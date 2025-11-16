export type TestStatus = "running" | "completed" | "failed" | "pending" | "queued"
export type AgentType =
  | "frontend"
  | "backend"
  | "performance"
  | "api"
  | "security"
  | "integration"
  | "ui"
  | "visual-regression"
  | "e2e"
  | "accessibility"

export type PipelineStageStatus = "running" | "completed" | "failed" | "pending" | "skipped"

export interface ExecutionStep {
  id: string
  name: string
  status: PipelineStageStatus
  duration?: string
  startTime: string
  endTime?: string
  logs: string[]
  agent?: string
  tool?: string
}

export interface SubStep {
  id: string
  name: string
  status: PipelineStageStatus
  duration?: string
  startTime: string
  endTime?: string
  logs: string[]
  executionSteps?: ExecutionStep[]
  testType?: string
}

export interface PipelineStage {
  id: string
  name: string
  status: PipelineStageStatus
  duration?: string
  startTime: string
  endTime?: string
  progress: number
  subSteps: SubStep[]
  category?: string
}

export interface TestPipeline {
  id: string
  testRunId: string
  stages: PipelineStage[]
  totalDuration?: string
  startTime: string
  endTime?: string
}

export interface TestRun {
  id: string
  agentType: AgentType
  agentName: string
  status: TestStatus
  duration?: string
  startTime: string
  endTime?: string
  progress: number
  testsRun?: number
  testsPassed?: number
  testsFailed?: number
  logs?: string[]
  pipeline?: TestPipeline
}

export interface JiraStory {
  id: string
  jiraId: string
  title: string
  branch: string
  author: string
  commit: string
  triggeredBy: string
  status: "running" | "completed" | "failed" | "partial"
  testRuns: TestRun[]
  repository: string
  repositoryUrl: string
  startTime: string
  endTime?: string
}

export interface Team {
  id: string
  name: string
  description: string
  project: string
  repository: string
  repositoryUrl: string
  stories: JiraStory[]
}

function createCompletePipeline(testRunId: string): TestPipeline {
  const baseTime = Date.now()

  return {
    id: `pipeline-${testRunId}`,
    testRunId,
    startTime: new Date(baseTime - 15 * 60000).toISOString(),
    endTime: new Date(baseTime - 4 * 60000).toISOString(),
    totalDuration: "11m",
    stages: [
      {
        id: "stage-test-planning",
        name: "Test Planning",
        status: "completed",
        progress: 100,
        startTime: new Date(baseTime - 15 * 60000).toISOString(),
        endTime: new Date(baseTime - 14 * 60000).toISOString(),
        duration: "1m",
        subSteps: [
          {
            id: "planning-1",
            name: "Initiation",
            status: "completed",
            logs: [
              "[10:15:00] 🚀 Initializing Test Planning Pipeline",
              "[10:15:01] ✓ Loading pipeline configuration",
              "[10:15:02] ✓ Validating environment variables",
              "[10:15:03] ✓ Connecting to test orchestrator",
              "[10:15:04] ✓ Pipeline initialization complete",
            ],
            startTime: new Date(baseTime - 15 * 60000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 55000).toISOString(),
            duration: "5s",
          },
          {
            id: "planning-2",
            name: "Fetch JIRA ticket details",
            status: "completed",
            logs: [
              "[10:15:05] 📋 Fetching JIRA ticket: RB-1245",
              "[10:15:06] ✓ Authenticated with JIRA API",
              "[10:15:07] ✓ Retrieved ticket metadata",
              "[10:15:08] ✓ Title: Add biometric authentication to login flow",
              "[10:15:09] ✓ Issue Type: Story | Priority: High",
              "[10:15:10] ✓ Components: Mobile Banking, Security",
              "[10:15:11] ✓ Linked issues: 3 dependencies found",
              "[10:15:12] ✓ Acceptance criteria: 5 criteria extracted",
              "[10:15:13] ✓ JIRA ticket details successfully retrieved",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 55000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 46000).toISOString(),
            duration: "9s",
          },
          {
            id: "planning-3",
            name: "Analyse code",
            status: "completed",
            logs: [
              "[10:15:14] 🔍 Starting code analysis on branch: feature/biometric-auth",
              "[10:15:15] ✓ Cloning repository: retail-bank/mobile-banking",
              "[10:15:18] ✓ Checking out branch: feature/biometric-auth (commit: a7f9c2e)",
              "[10:15:19] ✓ Analyzing changed files: 15 files modified",
              "[10:15:21] ✓ Identified components: AuthenticationService, BiometricManager",
              "[10:15:23] ✓ Detected API endpoints: /api/auth/biometric, /api/auth/verify",
              "[10:15:25] ✓ Found UI components: LoginScreen, BiometricPrompt",
              "[10:15:27] ✓ Dependencies analysis: 3 new dependencies added",
              "[10:15:28] ✓ Code complexity metrics calculated",
              "[10:15:29] ✓ Code analysis complete",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 46000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 30000).toISOString(),
            duration: "16s",
          },
          {
            id: "planning-4",
            name: "Extract Requirements",
            status: "completed",
            logs: [
              "[10:15:30] 📝 Extracting test requirements",
              "[10:15:31] ✓ Parsing acceptance criteria from JIRA",
              "[10:15:32] ✓ Requirement 1: Biometric authentication must work on iOS",
              "[10:15:33] ✓ Requirement 2: Fallback to PIN if biometric fails",
              "[10:15:34] ✓ Requirement 3: Support Face ID and Touch ID",
              "[10:15:35] ✓ Requirement 4: Secure token storage after authentication",
              "[10:15:36] ✓ Requirement 5: Handle biometric permission scenarios",
              "[10:15:37] ✓ Identified 12 functional requirements",
              "[10:15:38] ✓ Identified 8 non-functional requirements",
              "[10:15:39] ✓ Requirements extraction complete",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 30000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 20000).toISOString(),
            duration: "10s",
          },
          {
            id: "planning-5",
            name: "Generate Plan",
            status: "completed",
            logs: [
              "[10:15:40] 🎯 Generating comprehensive test plan",
              "[10:15:41] ✓ AI model: GPT-4.1 initialized",
              "[10:15:43] ✓ Analyzing requirements and code changes",
              "[10:15:45] ✓ Generated test scenarios: 45 scenarios",
              "[10:15:46] ✓ Unit tests: 18 test cases",
              "[10:15:47] ✓ Integration tests: 12 test cases",
              "[10:15:48] ✓ UI tests: 10 test cases",
              "[10:15:49] ✓ Security tests: 5 test cases",
              "[10:15:50] ✓ Test data requirements identified",
              "[10:15:51] ✓ Test environment configuration defined",
              "[10:15:52] ✓ Test plan generation complete",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 20000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 8000).toISOString(),
            duration: "12s",
          },
          {
            id: "planning-6",
            name: "Review and Enhance",
            status: "completed",
            logs: [
              "[10:15:53] 🔬 Reviewing and enhancing test plan",
              "[10:15:54] ✓ Validating test coverage completeness",
              "[10:15:55] ✓ Coverage analysis: 95% code coverage achievable",
              "[10:15:56] ✓ Checking for edge cases and boundary conditions",
              "[10:15:57] ✓ Added 3 edge case scenarios",
              "[10:15:58] ✓ Enhanced security test scenarios",
              "[10:15:59] ✓ Optimized test execution order",
              "[10:16:00] ✓ Added performance benchmarks",
              "[10:16:01] ✓ Review and enhancement complete",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 8000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 4000).toISOString(),
            duration: "4s",
          },
          {
            id: "planning-7",
            name: "Validate Plan",
            status: "completed",
            logs: [
              "[10:16:02] ✅ Validating test plan quality",
              "[10:16:03] ✓ Running validation rules: 15 rules",
              "[10:16:04] ✓ Checking test scenario completeness",
              "[10:16:05] ✓ Verifying requirement traceability",
              "[10:16:06] ✓ All requirements mapped to test cases",
              "[10:16:07] ✓ Validating test data sufficiency",
              "[10:16:08] ✓ Checking test dependencies",
              "[10:16:09] ✓ Plan validation passed: 15/15 rules",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 4000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000 - 2000).toISOString(),
            duration: "2s",
          },
          {
            id: "planning-8",
            name: "Attach to JIRA",
            status: "completed",
            logs: [
              "[10:16:10] 📎 Attaching test plan to JIRA ticket",
              "[10:16:11] ✓ Generating test plan document",
              "[10:16:12] ✓ Creating PDF report: test-plan-RB-1245.pdf",
              "[10:16:13] ✓ Uploading to JIRA ticket: RB-1245",
              "[10:16:14] ✓ Adding comment with test plan summary",
              "[10:16:15] ✓ Updating ticket status: Ready for Testing",
              "[10:16:16] ✓ Test plan successfully attached",
            ],
            startTime: new Date(baseTime - 14 * 60000 - 2000).toISOString(),
            endTime: new Date(baseTime - 14 * 60000).toISOString(),
            duration: "2s",
          },
        ],
      },
      {
        id: "stage-test-generation",
        name: "Test Generation & Execution",
        status: "completed",
        progress: 100,
        category: "Test Automation",
        startTime: new Date(baseTime - 14 * 60000).toISOString(),
        endTime: new Date(baseTime - 6 * 60000).toISOString(),
        duration: "8m",
        subSteps: [
          {
            id: "gen-functional",
            name: "Functional Tests",
            status: "completed",
            testType: "Unit & Integration",
            duration: "2m 30s",
            startTime: new Date(baseTime - 14 * 60000).toISOString(),
            endTime: new Date(baseTime - 13 * 60000 - 30000).toISOString(),
            logs: [
              "[10:16:00] 🧪 Starting Functional Tests workflow",
              "[10:16:01] ✓ Initialized Functional Test pipeline",
            ],
            executionSteps: [
              {
                id: "func-code-creation",
                name: "Code Creation",
                status: "completed",
                duration: "45s",
                agent: "CodeGenAgent",
                tool: "GPT-4 Turbo",
                startTime: new Date(baseTime - 14 * 60000).toISOString(),
                endTime: new Date(baseTime - 13 * 60000 - 45000).toISOString(),
                logs: [
                  "[10:16:00] 🚀 Starting AI-powered code generation",
                  "[10:16:02] 📋 Analyzing business logic and requirements",
                  "[10:16:05] ✓ Identified 8 core authentication methods to test",
                  "[10:16:08] ⚡ Generating unit tests for AuthenticationService",
                  "[10:16:10] ✓ Generated: AuthenticationService.test.ts (245 lines, 18 test cases)",
                  "[10:16:12] ⚡ Generating unit tests for BiometricManager",
                  "[10:16:15] ✓ Generated: BiometricManager.test.ts (198 lines, 15 test cases)",
                  "[10:16:18] ⚡ Generating tests for TokenManager, SessionHandler",
                  "[10:16:22] ✓ Generated: TokenManager.test.ts (132 lines, 9 test cases)",
                  "[10:16:25] ✓ Generated: SessionHandler.test.ts (156 lines, 12 test cases)",
                  "[10:16:28] 📊 Generated 12 functional test files total",
                  "[10:16:30] 📈 Total: 1,580 lines of test code",
                  "[10:16:32] ✓ Added test fixtures and mock data",
                  "[10:16:35] ✅ Code generation complete - 54 test cases created",
                ],
              },
              {
                id: "func-repo-update",
                name: "Repository Update",
                status: "completed",
                duration: "20s",
                agent: "GitOpsAgent",
                tool: "GitHub API",
                startTime: new Date(baseTime - 13 * 60000 - 45000).toISOString(),
                endTime: new Date(baseTime - 13 * 60000 - 25000).toISOString(),
                logs: [
                  "[10:16:45] 🔄 Connecting to GitHub repository",
                  "[10:16:46] ✓ Authenticated successfully",
                  "[10:16:47] 🌿 Creating branch: feature/functional-tests-RB-1245",
                  "[10:16:48] 📦 Staging 12 test files for commit",
                  "[10:16:49] ✓ Files staged: 1,580 lines across 12 files",
                  "[10:16:50] 💾 Committing changes with message: 'Add functional tests for biometric auth'",
                  "[10:16:52] ⬆️  Pushing to remote: origin/feature/functional-tests-RB-1245",
                  "[10:16:55] ✓ Successfully pushed to remote",
                  "[10:16:57] 🔀 Creating pull request",
                  "[10:17:00] ✓ PR #456 created: 'Add functional tests for biometric auth'",
                  "[10:17:02] 📎 Linked PR to JIRA ticket RB-1245",
                  "[10:17:05] ✅ Repository update complete",
                ],
              },
              {
                id: "func-execution",
                name: "Test Execution",
                status: "completed",
                duration: "1m 15s",
                agent: "TestRunnerAgent",
                tool: "Jest",
                startTime: new Date(baseTime - 13 * 60000 - 25000).toISOString(),
                endTime: new Date(baseTime - 12 * 60000 - 10000).toISOString(),
                logs: [
                  "[10:17:10] 🧪 Initializing Jest test runner",
                  "[10:17:12] ✓ Test environment configured",
                  "[10:17:13] 📊 Loading test suites: 12 files",
                  "[10:17:15] ▶️  Running AuthenticationService.test.ts",
                  "[10:17:18]    ✓ login with valid credentials",
                  "[10:17:20]    ✓ login with invalid credentials",
                  "[10:17:22]    ✓ biometric authentication flow",
                  "[10:17:25]    ✓ token refresh mechanism",
                  "[10:17:30] ✅ AuthenticationService: 18/18 tests passed",
                  "[10:17:35] ▶️  Running BiometricManager.test.ts",
                  "[10:17:38]    ✓ Face ID enrollment",
                  "[10:17:40]    ✓ Touch ID verification",
                  "[10:17:42]    ✓ biometric data encryption",
                  "[10:17:45]    ✓ fallback to PIN authentication",
                  "[10:17:50] ✅ BiometricManager: 15/15 tests passed",
                  "[10:17:55] ▶️  Running TokenManager and SessionHandler tests",
                  "[10:18:10] ✅ All 54 functional tests passed (0 failed)",
                  "[10:18:15] 📊 Test Suites: 12 passed, 12 total",
                  "[10:18:20] 📈 Code coverage: 92.3% (Statements: 1,456/1,580)",
                  "[10:18:25] ✅ Test execution complete - All tests passed!",
                ],
              },
              {
                id: "func-defect-detection",
                name: "Defect Detection",
                status: "completed",
                duration: "10s",
                agent: "AnalysisAgent",
                tool: "SonarQube",
                startTime: new Date(baseTime - 12 * 60000 - 10000).toISOString(),
                endTime: new Date(baseTime - 12 * 60000).toISOString(),
                logs: [
                  "[10:18:30] 🔍 Starting static code analysis",
                  "[10:18:31] 📊 Scanning 12 test files for defects",
                  "[10:18:32] ✓ Analyzing code quality and maintainability",
                  "[10:18:34] ✓ Security vulnerability scan: 0 issues",
                  "[10:18:35] ✓ Code duplication check: 2.1% duplication",
                  "[10:18:36] ✓ Critical issues: 0",
                  "[10:18:37] ✓ Major issues: 0",
                  "[10:18:38] ⚠️  Minor code smells: 2 detected",
                  "[10:18:39] 📈 Quality Score: A (98/100)",
                  "[10:18:40] ✅ Quality gate passed - Code meets standards",
                ],
              },
            ],
          },
          {
            id: "gen-ui",
            name: "UI Tests",
            status: "completed",
            testType: "E2E UI",
            duration: "3m 15s",
            startTime: new Date(baseTime - 12 * 60000).toISOString(),
            endTime: new Date(baseTime - 9 * 60000 - 45000).toISOString(),
            logs: [
              "[10:18:40] 🎨 Starting UI Tests workflow",
              "[10:18:41] ✓ Initialized UI Test pipeline",
            ],
            executionSteps: [
              {
                id: "ui-code-creation",
                name: "Code Creation",
                status: "completed",
                duration: "1m",
                agent: "UITestAgent",
                tool: "GPT-4 Vision",
                startTime: new Date(baseTime - 12 * 60000).toISOString(),
                endTime: new Date(baseTime - 11 * 60000).toISOString(),
                logs: [
                  "[10:18:40] 🎨 Initializing UI test generation with AI vision",
                  "[10:18:42] 🔍 Analyzing UI components and user flows",
                  "[10:18:45] ✓ Identified 8 critical UI components",
                  "[10:18:47] ⚡ Generating E2E tests for LoginScreen",
                  "[10:18:50] ✓ Generated: LoginScreen.spec.ts (156 lines, 12 test cases)",
                  "[10:18:52] ⚡ Generating tests for BiometricPrompt",
                  "[10:18:55] ✓ Generated: BiometricPrompt.spec.ts (132 lines, 8 test cases)",
                  "[10:18:58] ⚡ Generating tests for DashboardScreen",
                  "[10:19:02] ✓ Generated: DashboardScreen.spec.ts (145 lines, 10 test cases)",
                  "[10:19:05] ⚡ Generating tests for SettingsScreen",
                  "[10:19:08] ✓ Generated: SettingsScreen.spec.ts (128 lines, 9 test cases)",
                  "[10:19:12] 📊 Generated 8 UI test files",
                  "[10:19:15] 📈 Total: 940 lines of E2E test code",
                  "[10:19:18] ✓ Added page object models and fixtures",
                  "[10:19:20] ✅ UI test generation complete - 39 test cases created",
                ],
              },
              {
                id: "ui-repo-update",
                name: "Repository Update",
                status: "completed",
                duration: "15s",
                agent: "GitOpsAgent",
                tool: "GitHub API",
                startTime: new Date(baseTime - 11 * 60000).toISOString(),
                endTime: new Date(baseTime - 10 * 60000 - 45000).toISOString(),
                logs: [
                  "[10:19:40] 🔄 Connecting to GitHub repository",
                  "[10:19:41] ✓ Authenticated successfully",
                  "[10:19:42] 🌿 Creating branch: feature/ui-tests-RB-1245",
                  "[10:19:43] 📦 Staging 8 UI test files",
                  "[10:19:44] ✓ Files staged: 940 lines across 8 files",
                  "[10:19:45] 💾 Committing: 'Add E2E UI tests for biometric flow'",
                  "[10:19:47] ⬆️  Pushing to remote repository",
                  "[10:19:50] 🔀 Creating pull request",
                  "[10:19:52] ✓ PR #457 created: 'Add UI tests for biometric flow'",
                  "[10:19:55] ✅ Repository update complete",
                ],
              },
              {
                id: "ui-execution",
                name: "Test Execution",
                status: "completed",
                duration: "1m 45s",
                agent: "E2ERunnerAgent",
                tool: "Playwright",
                startTime: new Date(baseTime - 10 * 60000 - 45000).toISOString(),
                endTime: new Date(baseTime - 9 * 60000).toISOString(),
                logs: [
                  "[10:20:00] 🎭 Starting Playwright E2E test runner",
                  "[10:20:02] 🌐 Launching browser: Chromium (headless)",
                  "[10:20:05] ✓ Browser context initialized",
                  "[10:20:07] 📊 Loading 8 test suites",
                  "[10:20:10] ▶️  Running LoginScreen.spec.ts",
                  "[10:20:15]    ✓ should display login form",
                  "[10:20:18]    ✓ should handle valid login",
                  "[10:20:22]    ✓ should show error for invalid credentials",
                  "[10:20:25]    ✓ should navigate to biometric setup",
                  "[10:20:30] ✅ LoginScreen: 12/12 tests passed",
                  "[10:20:35] ▶️  Running BiometricPrompt.spec.ts",
                  "[10:20:38]    ✓ should display Face ID prompt",
                  "[10:20:42]    ✓ should handle successful authentication",
                  "[10:20:45]    ✓ should handle authentication failure",
                  "[10:20:48]    ✓ should fallback to PIN entry",
                  "[10:20:52] ✅ BiometricPrompt: 8/8 tests passed",
                  "[10:20:58] ▶️  Running remaining UI test suites",
                  "[10:21:15] ✅ DashboardScreen: 10/10 tests passed",
                  "[10:21:30] ✅ SettingsScreen: 9/9 tests passed",
                  "[10:21:40] ✅ All 39 UI tests passed (0 failed)",
                  "[10:21:42] 📊 Test Suites: 8 passed, 8 total",
                  "[10:21:45] 📸 Screenshots captured: 24 images",
                ],
              },
              {
                id: "ui-defect-detection",
                name: "Defect Detection",
                status: "completed",
                duration: "15s",
                agent: "VisualAgent",
                tool: "Percy.io",
                startTime: new Date(baseTime - 9 * 60000).toISOString(),
                endTime: new Date(baseTime - 8 * 60000 - 45000).toISOString(),
                logs: [
                  "[10:21:45] 📸 Starting visual regression testing",
                  "[10:21:47] 📂 Uploading 24 screenshots for analysis",
                  "[10:21:50] ✓ Baseline images loaded: 24 images",
                  "[10:21:52] 🔍 Comparing screenshots pixel-by-pixel",
                  "[10:21:55] ✓ LoginScreen: No visual changes",
                  "[10:21:57] ✓ BiometricPrompt: No visual changes",
                  "[10:21:59] ✓ DashboardScreen: No visual changes",
                  "[10:22:00] ✅ Visual regression passed - 0 differences detected",
                ],
              },
            ],
          },
          {
            id: "gen-performance",
            name: "Performance Tests",
            status: "completed",
            testType: "Load Test",
            duration: "3m 25s",
            startTime: new Date(baseTime - 8 * 60000 - 45000).toISOString(),
            logs: [
              "[10:22:00] ⚡ Starting Performance Tests workflow",
              "[10:22:01] ✓ Initialized Performance Test pipeline",
            ],
            executionSteps: [
              {
                id: "perf-code-creation",
                name: "Code Creation",
                status: "completed",
                duration: "40s",
                agent: "PerfTestAgent",
                tool: "GPT-4",
                startTime: new Date(baseTime - 8 * 60000 - 45000).toISOString(),
                endTime: new Date(baseTime - 8 * 60000 - 5000).toISOString(),
                logs: [
                  "[10:22:00] ⚡ Initializing performance test generation",
                  "[10:22:02] 🔍 Analyzing API endpoints and load patterns",
                  "[10:22:05] ✓ Identified 12 critical endpoints for testing",
                  "[10:22:08] ⚡ Generating load tests for authentication endpoints",
                  "[10:22:12] ✓ Generated: auth-load.test.js (180 lines)",
                  "[10:22:15] ⚡ Generating load tests for biometric endpoints",
                  "[10:22:20] ✓ Generated: biometric-load.test.js (165 lines)",
                  "[10:22:23] ⚡ Generating stress test scenarios",
                  "[10:22:27] ✓ Generated: stress-test.js (142 lines)",
                  "[10:22:30] 📊 Generated 5 performance test files",
                  "[10:22:33] 📈 Total: 687 lines of k6 test code",
                  "[10:22:35] ✓ Added load profiles: spike, soak, stress",
                  "[10:22:40] ✅ Performance test generation complete",
                ],
              },
              {
                id: "perf-repo-update",
                name: "Repository Update",
                status: "completed",
                duration: "12s",
                agent: "GitOpsAgent",
                tool: "GitHub API",
                startTime: new Date(baseTime - 8 * 60000 - 5000).toISOString(),
                endTime: new Date(baseTime - 7 * 60000 - 53000).toISOString(),
                logs: [
                  "[10:22:45] 🔄 Connecting to GitHub repository",
                  "[10:22:46] ✓ Authenticated successfully",
                  "[10:22:47] 🌿 Creating branch: feature/perf-tests-RB-1245",
                  "[10:22:48] 📦 Staging 5 performance test files",
                  "[10:22:49] ✓ Files staged: 687 lines across 5 files",
                  "[10:22:50] 💾 Committing: 'Add load and stress tests'",
                  "[10:22:52] ⬆️  Pushing to remote repository",
                  "[10:22:55] 🔀 Creating pull request",
                  "[10:22:56] ✓ PR #458 created: 'Add performance tests'",
                  "[10:22:57] ✅ Repository update complete",
                ],
              },
              {
                id: "perf-execution",
                name: "Test Execution",
                status: "completed",
                duration: "2m 20s",
                agent: "LoadTestAgent",
                tool: "k6",
                startTime: new Date(baseTime - 7 * 60000 - 53000).toISOString(),
                logs: [
                  "[10:23:00] ⚡ Starting k6 load testing framework",
                  "[10:23:02] 📊 Loading test configuration and scenarios",
                  "[10:23:05] ✓ Test profile: Ramp-up to 100 VUs over 2 minutes",
                  "[10:23:08] 🚀 Initiating load test execution",
                  "[10:23:10] 🔄 Ramping up: 10 VUs active",
                  "[10:23:15] 📈 25 VUs | Avg response: 45ms | RPS: 125",
                  "[10:23:20] 📈 50 VUs | Avg response: 85ms | RPS: 245",
                  "[10:23:30] 📈 75 VUs | Avg response: 105ms | RPS: 380",
                  "[10:23:40] 📈 100 VUs | Avg response: 120ms | RPS: 475",
                  "[10:23:50] ✓ Sustained load: 100 VUs for 30 seconds",
                  "[10:24:10] 📊 Peak load maintained successfully",
                  "[10:24:30] 🔄 Ramping down: 75 VUs active",
                  "[10:24:50] 🔄 Ramping down: 50 VUs active",
                  "[10:25:00] 🔄 Ramping down: 25 VUs active",
                  "[10:25:10] ✓ Test execution completed",
                  "[10:25:15] 📊 Total requests: 28,450",
                  "[10:25:18] 📈 Success rate: 99.98% (28,444 passed)",
                  "[10:25:20] ✅ Load test completed successfully",
                ],
              },
              {
                id: "perf-defect-detection",
                name: "Defect Detection",
                status: "completed",
                duration: "25s",
                agent: "AnalysisAgent",
                tool: "Grafana",
                startTime: new Date(baseTime - 6 * 60000 - 25000).toISOString(),
                endTime: new Date(baseTime - 6 * 60000).toISOString(),
                logs: [
                  "[10:25:20] 📊 Starting performance analysis",
                  "[10:25:22] 🔍 Analyzing response time metrics",
                  "[10:25:25] ✓ P50 response time: 95ms (threshold: <200ms)",
                  "[10:25:28] ✓ P95 response time: 145ms (threshold: <500ms)",
                  "[10:25:30] ✓ P99 response time: 185ms (threshold: <1000ms)",
                  "[10:25:32] 🔍 Analyzing throughput metrics",
                  "[10:25:35] ✓ Peak RPS: 475 req/sec",
                  "[10:25:38] ✓ Average RPS: 380 req/sec",
                  "[10:25:40] 🔍 Checking for performance bottlenecks",
                  "[10:25:42] ✓ No performance degradation detected",
                  "[10:25:45] ✅ All performance thresholds met",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "stage-validation",
        name: "Validate Execution",
        status: "completed",
        category: "Quality Gate",
        progress: 100,
        startTime: new Date(baseTime - 6 * 60000).toISOString(),
        endTime: new Date(baseTime - 5 * 60000 - 15000).toISOString(),
        duration: "45s",
        subSteps: [
          {
            id: "validate-1",
            name: "Aggregate Test Results",
            status: "completed",
            startTime: new Date(baseTime - 6 * 60000).toISOString(),
            endTime: new Date(baseTime - 5 * 60000 - 50000).toISOString(),
            duration: "10s",
            logs: [
              "[10:25:45] 📊 Aggregating test results from all stages",
              "[10:25:47] ✓ Functional tests: 54/54 passed (100%)",
              "[10:25:48] ✓ UI tests: 39/39 passed (100%)",
              "[10:25:49] ✓ Performance tests: All thresholds met",
              "[10:25:50] ✓ Code coverage: 92.3%",
              "[10:25:52] ✓ Quality score: A (98/100)",
              "[10:25:55] ✅ Results aggregation complete",
            ],
          },
          {
            id: "validate-2",
            name: "Quality Gate Check",
            status: "completed",
            startTime: new Date(baseTime - 5 * 60000 - 50000).toISOString(),
            endTime: new Date(baseTime - 5 * 60000 - 35000).toISOString(),
            duration: "15s",
            logs: [
              "[10:25:55] 🚦 Running quality gate validation",
              "[10:25:57] ✓ Minimum test coverage: PASSED (92.3% > 80%)",
              "[10:25:59] ✓ All critical tests passing: PASSED (100%)",
              "[10:26:01] ✓ No critical defects: PASSED",
              "[10:26:03] ✓ Performance benchmarks met: PASSED",
              "[10:26:05] ✓ Code quality standards: PASSED (A grade)",
              "[10:26:07] ✓ Security vulnerabilities: PASSED (0 issues)",
              "[10:26:10] ✅ All quality gates passed - Ready for deployment",
            ],
          },
          {
            id: "validate-3",
            name: "Update JIRA Status",
            status: "completed",
            startTime: new Date(baseTime - 5 * 60000 - 35000).toISOString(),
            endTime: new Date(baseTime - 5 * 60000 - 15000).toISOString(),
            duration: "20s",
            logs: [
              "[10:26:10] 📎 Updating JIRA ticket status",
              "[10:26:12] ✓ Connected to JIRA API",
              "[10:26:15] ✓ Updating RB-1245 status",
              "[10:26:18] ✓ Added test execution summary comment",
              "[10:26:22] ✓ Attached test coverage report",
              "[10:26:25] ✓ Updated status: Ready for QA Sign-off",
              "[10:26:28] ✓ Tagged: qa-approved, tests-passing",
              "[10:26:30] ✅ JIRA ticket updated successfully",
            ],
          },
        ],
      },
      {
        id: "stage-reporting",
        name: "Report Generation",
        status: "completed",
        category: "Documentation",
        progress: 100,
        startTime: new Date(baseTime - 5 * 60000 - 15000).toISOString(),
        endTime: new Date(baseTime - 4 * 60000).toISOString(),
        duration: "1m 15s",
        subSteps: [
          {
            id: "report-1",
            name: "Generate HTML Report",
            status: "completed",
            startTime: new Date(baseTime - 5 * 60000 - 15000).toISOString(),
            endTime: new Date(baseTime - 4 * 60000 - 45000).toISOString(),
            duration: "30s",
            logs: [
              "[10:26:30] 📄 Generating comprehensive HTML test report",
              "[10:26:32] ✓ Loading test results data",
              "[10:26:35] ✓ Processing 93 total test cases",
              "[10:26:38] ✓ Generating summary dashboard",
              "[10:26:42] ✓ Creating detailed test case breakdown",
              "[10:26:45] ✓ Adding code coverage visualization",
              "[10:26:48] ✓ Including performance metrics charts",
              "[10:26:52] ✓ Embedding screenshots and logs",
              "[10:26:55] ✓ Applying report styling and branding",
              "[10:27:00] ✅ HTML report generated: test-report-RB-1245.html",
            ],
          },
          {
            id: "report-2",
            name: "Generate PDF Summary",
            status: "completed",
            startTime: new Date(baseTime - 4 * 60000 - 45000).toISOString(),
            endTime: new Date(baseTime - 4 * 60000 - 25000).toISOString(),
            duration: "20s",
            logs: [
              "[10:27:00] 📋 Creating executive summary PDF",
              "[10:27:02] ✓ Compiling test execution summary",
              "[10:27:05] ✓ Adding quality metrics overview",
              "[10:27:08] ✓ Including pass/fail statistics",
              "[10:27:11] ✓ Adding trend analysis",
              "[10:27:14] ✓ Generating recommendations section",
              "[10:27:17] ✓ Formatting PDF document",
              "[10:27:20] ✅ PDF report generated: executive-summary-RB-1245.pdf",
            ],
          },
          {
            id: "report-3",
            name: "Upload Reports to Storage",
            status: "completed",
            startTime: new Date(baseTime - 4 * 60000 - 25000).toISOString(),
            endTime: new Date(baseTime - 4 * 60000 - 10000).toISOString(),
            duration: "15s",
            logs: [
              "[10:27:20] ☁️  Uploading reports to cloud storage",
              "[10:27:22] ✓ Connecting to AWS S3",
              "[10:27:24] ⬆️  Uploading HTML report (2.4 MB)",
              "[10:27:28] ⬆️  Uploading PDF summary (458 KB)",
              "[10:27:30] ⬆️  Uploading test artifacts (1.8 MB)",
              "[10:27:33] ✓ All files uploaded successfully",
              "[10:27:35] ✅ Reports available at: https://reports.example.com/RB-1245",
            ],
          },
          {
            id: "report-4",
            name: "Send Notifications",
            status: "completed",
            startTime: new Date(baseTime - 4 * 60000 - 10000).toISOString(),
            endTime: new Date(baseTime - 4 * 60000).toISOString(),
            duration: "10s",
            logs: [
              "[10:27:35] 📧 Sending notification emails",
              "[10:27:37] ✓ Preparing email with report links",
              "[10:27:39] ✓ Sending to stakeholders: 8 recipients",
              "[10:27:41] ✓ Posting to Slack channel: #qa-automation",
              "[10:27:43] ✓ Updating project dashboard",
              "[10:27:45] ✅ All notifications sent successfully",
            ],
          },
        ],
      },
    ],
  }
}

function createRunningPipeline(testRunId: string): TestPipeline {
  const baseTime = Date.now()

  return {
    id: `pipeline-${testRunId}`,
    testRunId,
    startTime: new Date(baseTime - 8 * 60000).toISOString(),
    stages: [
      {
        id: "stage-test-planning-run",
        name: "Test Planning",
        status: "completed",
        progress: 100,
        startTime: new Date(baseTime - 8 * 60000).toISOString(),
        endTime: new Date(baseTime - 7 * 60000).toISOString(),
        duration: "1m",
        subSteps: [
          {
            id: "planning-run-1",
            name: "Initiation",
            status: "completed",
            startTime: new Date(baseTime - 8 * 60000).toISOString(),
            endTime: new Date(baseTime - 7 * 60000 - 55000).toISOString(),
            duration: "5s",
            logs: [],
          },
        ],
      },
    ],
  }
}

export const mockTeams: Team[] = [
  {
    id: "QEA",
    name: "Mobile Banking Team",
    description: "iOS and Android mobile banking applications",
    project: "Retail Banking Platform",
    repository: "retail-bank/mobile-banking",
    repositoryUrl: "https://github.com/retail-bank/mobile-banking",
    stories: [
      {
        id: "pipeline-1",
        jiraId: "RB-1245",
        title: "Add biometric authentication to login flow",
        branch: "feature/biometric-auth",
        author: "Sarah Chen",
        commit: "a7f9c2e",
        triggeredBy: "Push to feature/biometric-auth",
        status: "completed",
        repository: "retail-bank/mobile-banking",
        repositoryUrl: "https://github.com/retail-bank/mobile-banking",
        startTime: new Date(Date.now() - 15 * 60000).toISOString(),
        endTime: new Date(Date.now() - 11 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-1",
            agentType: "ui",
            agentName: "QA Pipeline",
            status: "completed",
            duration: "4m 23s",
            startTime: new Date(Date.now() - 15 * 60000).toISOString(),
            endTime: new Date(Date.now() - 11 * 60000).toISOString(),
            progress: 100,
            testsRun: 45,
            testsPassed: 45,
            testsFailed: 0,
            pipeline: createCompletePipeline("run-1"),
          },
        ],
      },
      {
        id: "pipeline-2",
        jiraId: "RB-1198",
        title: "Implement transaction history filtering",
        branch: "feature/transaction-filters",
        author: "Michael Park",
        commit: "b3d8a1f",
        triggeredBy: "Push to feature/transaction-filters",
        status: "running",
        repository: "retail-bank/mobile-banking",
        repositoryUrl: "https://github.com/retail-bank/mobile-banking",
        startTime: new Date(Date.now() - 8 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-2",
            agentType: "ui",
            agentName: "QA Pipeline",
            status: "running",
            startTime: new Date(Date.now() - 8 * 60000).toISOString(),
            progress: 67,
            testsRun: 38,
            testsPassed: 37,
            testsFailed: 0,
            pipeline: createRunningPipeline("run-2"),
          },
        ],
      },
      {
        id: "pipeline-3",
        jiraId: "RB-1412",
        title: "Implement payment method management",
        branch: "feature/payment-methods",
        author: "Emma Davis",
        commit: "c2e5d1a",
        triggeredBy: "Push to feature/payment-methods",
        status: "failed",
        repository: "retail-bank/mobile-banking",
        repositoryUrl: "https://github.com/retail-bank/mobile-banking",
        startTime: new Date(Date.now() - 30 * 60000).toISOString(),
        endTime: new Date(Date.now() - 25 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-3",
            agentType: "ui",
            agentName: "QA Pipeline",
            status: "failed",
            duration: "5m 12s",
            startTime: new Date(Date.now() - 30 * 60000).toISOString(),
            endTime: new Date(Date.now() - 25 * 60000).toISOString(),
            progress: 100,
            testsRun: 42,
            testsPassed: 38,
            testsFailed: 4,
            pipeline: createCompletePipeline("run-3"),
          },
        ],
      },
    ],
  },
  {
    id: "team-2",
    name: "Core Banking Team",
    description: "Core banking systems and transaction processing",
    project: "Retail Banking Platform",
    repository: "retail-bank/core-banking",
    repositoryUrl: "https://github.com/retail-bank/core-banking",
    stories: [
      {
        id: "pipeline-4",
        jiraId: "RB-1401",
        title: "Optimize transaction processing engine",
        branch: "feature/optimize-transactions",
        author: "David Kumar",
        commit: "d4f7b9a",
        triggeredBy: "Push to feature/optimize-transactions",
        status: "completed",
        repository: "retail-bank/core-banking",
        repositoryUrl: "https://github.com/retail-bank/core-banking",
        startTime: new Date(Date.now() - 45 * 60000).toISOString(),
        endTime: new Date(Date.now() - 38 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-4",
            agentType: "backend",
            agentName: "QA Pipeline",
            status: "completed",
            duration: "7m 15s",
            startTime: new Date(Date.now() - 45 * 60000).toISOString(),
            endTime: new Date(Date.now() - 38 * 60000).toISOString(),
            progress: 100,
            testsRun: 156,
            testsPassed: 156,
            testsFailed: 0,
            pipeline: createCompletePipeline("run-4"),
          },
        ],
      },
      {
        id: "pipeline-5",
        jiraId: "RB-1389",
        title: "Add multi-currency support",
        branch: "feature/multi-currency",
        author: "Lisa Wang",
        commit: "e8c2d4b",
        triggeredBy: "Push to feature/multi-currency",
        status: "running",
        repository: "retail-bank/core-banking",
        repositoryUrl: "https://github.com/retail-bank/core-banking",
        startTime: new Date(Date.now() - 12 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-5",
            agentType: "backend",
            agentName: "QA Pipeline",
            status: "running",
            startTime: new Date(Date.now() - 12 * 60000).toISOString(),
            progress: 58,
            testsRun: 89,
            testsPassed: 87,
            testsFailed: 0,
            pipeline: createRunningPipeline("run-5"),
          },
        ],
      },
    ],
  },
  {
    id: "team-3",
    name: "Payment Gateway Team",
    description: "Payment processing and third-party integrations",
    project: "Retail Banking Platform",
    repository: "retail-bank/payment-gateway",
    repositoryUrl: "https://github.com/retail-bank/payment-gateway",
    stories: [
      {
        id: "pipeline-6",
        jiraId: "RB-1456",
        title: "Integrate new payment provider API",
        branch: "feature/payment-provider-x",
        author: "James Wilson",
        commit: "f1a9c7d",
        triggeredBy: "Push to feature/payment-provider-x",
        status: "completed",
        repository: "retail-bank/payment-gateway",
        repositoryUrl: "https://github.com/retail-bank/payment-gateway",
        startTime: new Date(Date.now() - 55 * 60000).toISOString(),
        endTime: new Date(Date.now() - 38 * 60000).toISOString(),
        testRuns: [
          {
            id: "run-6",
            agentType: "api",
            agentName: "QA Pipeline",
            status: "completed",
            duration: "17m 45s",
            startTime: new Date(Date.now() - 55 * 60000).toISOString(),
            endTime: new Date(Date.now() - 38 * 60000).toISOString(),
            progress: 100,
            testsRun: 304,
            testsPassed: 304,
            testsFailed: 0,
            pipeline: createCompletePipeline("run-6"),
          },
        ],
      },
    ],
  },
]

export const logTemplates = {
  ui: [
    "[{time}] Initializing UI test suite...",
    "[{time}] Starting browser: Chrome Headless",
    "[{time}] Loading test page: {url}",
    "[{time}] Testing button click interaction... PASSED ({duration}s)",
    "[{time}] Verifying form validation... PASSED ({duration}s)",
    "[{time}] Testing modal dialog behavior... PASSED ({duration}s)",
    "[{time}] Checking responsive layout... PASSED ({duration}s)",
    "[{time}] Testing navigation flow... RUNNING",
    "[{time}] Validating error states... RUNNING",
    "[{time}] Memory usage: {memory}MB",
  ],
  frontend: [
    "[{time}] Running React component tests...",
    "[{time}] Testing component rendering... PASSED ({duration}s)",
    "[{time}] Testing prop validation... PASSED ({duration}s)",
    "[{time}] Testing state management... PASSED ({duration}s)",
    "[{time}] Testing event handlers... PASSED ({duration}s)",
    "[{time}] Running snapshot tests... PASSED ({duration}s)",
    "[{time}] Testing hooks behavior... RUNNING",
    "[{time}] Code coverage: {coverage}%",
  ],
  backend: [
    "[{time}] Initializing API test suite...",
    "[{time}] Testing POST /api/transactions... PASSED ({duration}ms)",
    "[{time}] Testing GET /api/accounts... PASSED ({duration}ms)",
    "[{time}] Testing PUT /api/users... PASSED ({duration}ms)",
    "[{time}] Testing DELETE /api/sessions... PASSED ({duration}ms)",
    "[{time}] Validating request schemas... PASSED ({duration}ms)",
    "[{time}] Testing error handling... RUNNING",
    "[{time}] Database queries executed: {queries}",
  ],
  performance: [
    "[{time}] Starting performance test suite...",
    "[{time}] Ramping up to {users} concurrent users...",
    "[{time}] Avg response time: {latency}ms",
    "[{time}] Requests per second: {rps}",
    "[{time}] Testing under load: {percent}% capacity",
    "[{time}] Memory usage: {memory}MB",
    "[{time}] CPU usage: {cpu}%",
    "[{time}] Analyzing performance metrics... RUNNING",
  ],
  security: [
    "[{time}] Starting security scan...",
    "[{time}] Testing SQL injection vulnerabilities... PASSED",
    "[{time}] Testing XSS attack vectors... PASSED",
    "[{time}] Testing CSRF protection... PASSED",
    "[{time}] Scanning for dependency vulnerabilities...",
    "[{time}] Testing authentication bypass... PASSED",
    "[{time}] Testing authorization rules... RUNNING",
    "[{time}] Vulnerabilities found: {vulns}",
  ],
  integration: [
    "[{time}] Starting integration tests...",
    "[{time}] Testing microservice communication... PASSED",
    "[{time}] Testing database connections... PASSED",
    "[{time}] Testing external API calls... PASSED",
    "[{time}] Testing message queue integration... PASSED",
    "[{time}] Testing cache layer... RUNNING",
    "[{time}] End-to-end workflow validation... RUNNING",
  ],
  api: [
    "[{time}] Starting API test suite...",
    "[{time}] Testing authentication endpoints... PASSED",
    "[{time}] Testing data validation... PASSED",
    "[{time}] Testing error responses... PASSED",
    "[{time}] Load testing endpoints... RUNNING",
  ],
  "visual-regression": [
    "[{time}] Starting visual regression tests...",
    "[{time}] Capturing baseline screenshots...",
    "[{time}] Comparing visual differences... RUNNING",
  ],
  e2e: ["[{time}] Starting end-to-end tests...", "[{time}] User workflow test 1... RUNNING"],
  accessibility: ["[{time}] Starting accessibility audit...", "[{time}] Checking WCAG compliance... RUNNING"],
  performance_agent: ["[{time}] Running performance tests...", "[{time}] Memory profiling... RUNNING"],
}
