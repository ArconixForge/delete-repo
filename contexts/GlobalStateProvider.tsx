'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
// Import types, now including ErrorLog
import type { Team, JiraStory, TestRun, PipelineStage, SubStep, ExecutionStep, PipelineStageStatus, TestStatus, ErrorLog } from '@/lib/mock-data'

// --- TYPE DEFINITIONS FROM SSE ---
interface LogData {
  agent_id: string;      
  agent_name: string;    
  jira_ticket: string;   
  project: string;
  status: string;        
  stage: string;         
  progress?: number;     
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

// --- ADDED: Type for the 'error_log' event ---
// NOTE: We MUST assume 'project' and 'jira_ticket' are also sent 
// in the error payload to find the correct nested run.
interface ErrorData {
  agent_id: string;
  project: string;
  jira_ticket: string;
  timestamp: string;
  stage: string;
  message: string;
  severity?: string;
}
// --- END ADDED ---

interface GlobalState {
  teams: Team[]
  connectionStatus: string
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
  setConnectionStatus: React.Dispatch<React.SetStateAction<string>>
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]) 
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      try {
        const sseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!sseUrl) {
          console.error("❌ NEXT_PUBLIC_API_BASE_URL is not set!");
          setConnectionStatus('error');
          return; 
        }
        
        eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
          console.log(`✅ SSE Connected to ${sseUrl}`);
          setConnectionStatus('connected');
        };

        eventSource.onerror = (error) => {
          console.error('❌ SSE Error:', error);
          setConnectionStatus('error');
          eventSource?.close();
          console.log('Retrying SSE connection in 5 seconds...');
          setTimeout(connectSSE, 5000);
        };

        eventSource.addEventListener('log', (event) => {
          try {
            const logData: LogData = JSON.parse(event.data);
            console.log('📨 Parsed log data:', logData); // DEBUG
            setTeams(prevTeams => 
              updateStateFromLog(prevTeams, logData)
            );
          } catch (e) {
            console.error('Error parsing log event:', e);
          }
        });

        // --- ADDED: This entire listener is from App.js ---
        eventSource.addEventListener('error_log', (event) => {
          try {
            const errorData: ErrorData = JSON.parse(event.data);
            console.log('📨 Parsed ERROR data:', errorData); // DEBUG
            setTeams(prevTeams => 
              updateStateFromError(prevTeams, errorData)
            );
          } catch (e) {
            console.error('Error parsing error_log event:', e);
          }
        });
        // --- END ADDED ---

      } catch (error) {
        console.error('Failed to connect SSE:', error);
        setConnectionStatus('error');
      }
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []); 


  const value = {
    teams,
    connectionStatus,
    setTeams,
    setConnectionStatus,
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

/**
 * --- ADDED: New function to handle 'error_log' events ---
 * This function finds the existing run and adds an error to its
 * array, mirroring the 'error_log' listener in App.js.
 * It does NOT create new items, only updates existing ones.
 */
function updateStateFromError(prevTeams: Team[], errorData: ErrorData): Team[] {
  // 1. Find Team
  const teamIndex = prevTeams.findIndex(t => t.id === errorData.project);
  if (teamIndex === -1) return prevTeams; // Team not found, do nothing

  const newTeams = [...prevTeams];
  const team = { ...newTeams[teamIndex] };
  newTeams[teamIndex] = team;

  // 2. Find Story
  const storyId = `${errorData.project}-${errorData.jira_ticket}`;
  const storyIndex = team.stories.findIndex(s => s.id === storyId);
  if (storyIndex === -1) return newTeams; // Story not found, do nothing

  const stories = [...team.stories];
  team.stories = stories;
  const story = { ...stories[storyIndex] };
  stories[storyIndex] = story;

  // 3. Find Test Run
  const runIndex = story.testRuns.findIndex(r => r.id === errorData.agent_id);
  if (runIndex === -1) return newTeams; // Run not found, do nothing

  const testRuns = [...story.testRuns];
  story.testRuns = testRuns;
  const run = { ...testRuns[runIndex] };
  testRuns[runIndex] = run;

  // 4. Add the error (immutable update)
  const newError: ErrorLog = {
    timestamp: errorData.timestamp,
    stage: errorData.stage,
    message: errorData.message,
    severity: errorData.severity || 'medium',
  };

  // Ensure errors array exists
  if (!run.errors) run.errors = [];
  
  run.errors = [...run.errors, newError];

  // 5. Return the updated state
  return newTeams;
}


/**
 * --- MODIFIED: The original "FIX" function ---
 * This function is updated to initialize `errors: []`
 * when a new TestRun is created.
 */
function updateStateFromLog(prevTeams: Team[], logData: LogData): Team[] {
  
  // 1. Find the team index
  let teamIndex = prevTeams.findIndex(t => t.id === logData.project);
  let newTeams = [...prevTeams]; 
  let team: Team;
  if (teamIndex === -1) {
    // 2. Team not found - Create it
    team = {
      id: logData.project, 
      name: `${logData.project} Team`, 
      description: `Test runs for the ${logData.project} project`,
      project: logData.project,
      repository: "unknown", 
      repositoryUrl: "#", 
      stories: [],
    };
    newTeams.push(team); 
    teamIndex = newTeams.length - 1; 
  } else {
    team = { ...newTeams[teamIndex] };
    newTeams[teamIndex] = team;
  }

  // 3. Find the story index
  const storyId = `${logData.project}-${logData.jira_ticket}`;
  let storyIndex = team.stories.findIndex(s => s.id === storyId);
  let stories = [...team.stories]; 
  team.stories = stories;

  let story: JiraStory;
  if (storyIndex === -1) {
    // 4. Story not found - Create it
    story = {
      id: storyId,
      jiraId: logData.jira_ticket,
      title: `Story ${logData.jira_ticket}`, 
      branch: "unknown",
      author: "unknown",
      commit: "unknown",
      triggeredBy: "SSE",
      status: "running", 
      testRuns: [],
      repository: "unknown",
      repositoryUrl: "#",
      startTime: logData.timestamp,
    };
    stories.push(story);
    storyIndex = stories.length - 1;
  } else {
    story = { ...stories[storyIndex] };
    stories[storyIndex] = story;
  }
  
  // 5. Find the test run index
  let runIndex = story.testRuns.findIndex(r => r.id === logData.agent_id);
  let testRuns = [...story.testRuns]; 
  story.testRuns = testRuns;

  let run: TestRun;
  if (runIndex === -1) {
    // 6. Test run not found - Create it
    run = {
      id: logData.agent_id,
      agentType: "ui", 
      agentName: logData.agent_name || "Agent",
      status: "running",
      startTime: logData.timestamp,
      progress: logData.progress || 0,
      logs: [],
      // --- ADDED: Initialize errors array, just like App.js ---
      errors: [],
      // --- END ADDED ---
      pipeline: { 
        id: `pipeline-${logData.agent_id}`,
        testRunId: logData.agent_id,
        stages: [], 
        startTime: logData.timestamp,
      },
    };
    testRuns.push(run);
    runIndex = testRuns.length - 1;
  } else {
    run = { ...testRuns[runIndex] };
    testRuns[runIndex] = run;
  }

  // 7. Update story and run status based on log
  const newStatus = logData.level === 'ERROR' ? 'failed' : (logData.status || run.status);
  story.status = newStatus as JiraStory['status'];
  run.status = newStatus as TestRun['status'];
  run.progress = logData.progress !== undefined ? logData.progress : run.progress;

  // Add log to the run
  if (!run.logs) run.logs = [];
  run.logs.push(`[${new Date(logData.timestamp).toLocaleTimeString()}] [${logData.level}] ${logData.message}`);

  // 8. Ensure pipeline exists
  if (!run.pipeline) {
    run.pipeline = {
      id: `pipeline-${logData.agent_id}`,
      testRunId: logData.agent_id,
      stages: [],
      startTime: logData.timestamp,
    };
  }
  
  // 9. Update the pipeline
  let pipeline = { ...run.pipeline }; 
  run.pipeline = pipeline;
  let stages = [...pipeline.stages]; 
  pipeline.stages = stages;

  const stageId = logData.stage || "unknown_stage";
  let stageIndex = stages.findIndex(st => st.id === stageId);
  let stage: PipelineStage;

  if (stageIndex === -1) {
    // 10. Stage not found - Create it
    stage = {
      id: stageId,
      name: stageId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      status: newStatus as PipelineStageStatus,
      progress: logData.progress || 0,
      startTime: logData.timestamp,
      subSteps: [], 
    };
    stages.push(stage);
    stageIndex = stages.length - 1;
  } else {
    stage = { ...stages[stageIndex] };
    stages[stageIndex] = stage;
  }

  // 11. Update stage status and progress
  stage.status = newStatus as PipelineStageStatus;
  stage.progress = logData.progress !== undefined ? logData.progress : stage.progress;

  // 12. Create/Update SubStep
  let subSteps = [...stage.subSteps]; 
  stage.subSteps = subSteps;
  
  const subStepId = `${stageId}-logs`;
  let subStepIndex = subSteps.findIndex(ss => ss.id === subStepId);
  let subStep: SubStep;
  
  if (subStepIndex === -1) {
    subStep = {
      id: subStepId,
      name: "Execution Logs",
      status: newStatus as PipelineStageStatus,
      startTime: logData.timestamp,
      logs: [],
    };
    subSteps.push(subStep);
    subStepIndex = subSteps.length - 1;
  } else {
    subStep = { ...subSteps[subStepIndex] };
    subSteps[subStepIndex] = subStep;
  }

  subStep.status = newStatus as PipelineStageStatus;
  if (!subStep.logs) subStep.logs = [];
  subStep.logs.push(`[${new Date(logData.timestamp).toLocaleTimeString()}] [${logData.level}] ${logData.message}`);


  // 13. Return the new top-level teams array
  return newTeams;
}