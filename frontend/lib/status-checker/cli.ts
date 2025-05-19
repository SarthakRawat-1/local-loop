import { ConfigStatusChecker } from './index';
import chalk from 'chalk';

/**
 * CLI interface for the status checker
 */
export async function runStatusCheckerCLI() {
  console.log(chalk.bold('🔍 Local-Loop Configuration Status Check'));
  console.log(chalk.dim('Checking your local development environment...\n'));

  const checker = new ConfigStatusChecker();
  const report = await checker.checkAll();
  
  // Display individual check results
  report.checks.forEach(check => {
    let statusSymbol = '';
    let statusColor;
    
    switch (check.status) {
      case 'ok':
        statusSymbol = '✓';
        statusColor = chalk.green;
        break;
      case 'warning':
        statusSymbol = '⚠';
        statusColor = chalk.yellow;
        break;
      case 'error':
        statusSymbol = '✗';
        statusColor = chalk.red;
        break;
    }
    
    console.log(`${statusColor(statusSymbol)} ${chalk.bold(check.name)}: ${check.message}`);
  });
  
  // Display summary
  console.log('\n' + chalk.bold('Summary:'));
  console.log(`${chalk.green(report.summary.ok)} passed, ${chalk.yellow(report.summary.warnings)} warnings, ${chalk.red(report.summary.errors)} errors`);
  
  // Provide overall status
  if (report.summary.errors > 0) {
    console.log(chalk.red('\n❌ Your environment has issues that need to be fixed.'));
  } else if (report.summary.warnings > 0) {
    console.log(chalk.yellow('\n⚠️ Your environment has some minor issues.'));
  } else {
    console.log(chalk.green('\n✅ Your environment is properly configured!'));
  }
}

// Allow running directly from command line
if (require.main === module) {
  runStatusCheckerCLI().catch(console.error);
}
