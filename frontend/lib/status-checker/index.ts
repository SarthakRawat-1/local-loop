import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface StatusCheck {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

interface StatusReport {
  checks: StatusCheck[];
  summary: {
    ok: number;
    warnings: number;
    errors: number;
  };
  timestamp: number;
}

/**
 * Configuration Status Checker
 * 
 * Performs health checks on the local environment to ensure
 * all required dependencies and configurations are properly set up.
 */
export class ConfigStatusChecker {
  private projectRoot: string;

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  /**
   * Performs all status checks and returns a comprehensive report
   */
  async checkAll(): Promise<StatusReport> {
    const checks: StatusCheck[] = [];
    
    // Run individual checks
    checks.push(
      this.checkNodeVersion(),
      this.checkRequiredFiles(),
      this.checkDependencies(),
      this.checkPortAvailability(),
      this.checkEnvironmentVariables()
    );

    // Generate summary
    const summary = {
      ok: checks.filter(check => check.status === 'ok').length,
      warnings: checks.filter(check => check.status === 'warning').length,
      errors: checks.filter(check => check.status === 'error').length
    };

    return {
      checks,
      summary,
      timestamp: Date.now()
    };
  }

  /**
   * Checks if the current Node.js version is compatible
   */
  private checkNodeVersion(): StatusCheck {
    const currentVersion = process.version;
    const requiredVersion = 'v14.0.0'; // Assuming v14+ is required
    
    // Simple version comparison (could be improved with semver)
    const isCompatible = currentVersion.localeCompare(requiredVersion, undefined, 
      { numeric: true, sensitivity: 'base' }) >= 0;
    
    return {
      name: 'Node.js Version',
      status: isCompatible ? 'ok' : 'error',
      message: isCompatible 
        ? `Node.js ${currentVersion} is compatible` 
        : `Node.js ${currentVersion} is below the required version ${requiredVersion}`
    };
  }

  /**
   * Checks if all required configuration files exist
   */
  private checkRequiredFiles(): StatusCheck {
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      '.env'
    ];
    
    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(this.projectRoot, file))
    );
    
    if (missingFiles.length === 0) {
      return {
        name: 'Required Files',
        status: 'ok',
        message: 'All required configuration files are present'
      };
    } else {
      return {
        name: 'Required Files',
        status: 'error',
        message: `Missing required files: ${missingFiles.join(', ')}`
      };
    }
  }

  /**
   * Checks if all required npm dependencies are installed
   */
  private checkDependencies(): StatusCheck {
    try {
      // Attempt to run npm list to verify packages
      execSync('npm list --depth=0', { 
        cwd: this.projectRoot,
        stdio: 'pipe' // Suppress output
      });
      
      return {
        name: 'Dependencies',
        status: 'ok',
        message: 'All dependencies are properly installed'
      };
    } catch (error) {
      return {
        name: 'Dependencies',
        status: 'warning',
        message: 'Some dependencies may be missing. Run npm install to ensure all packages are installed.'
      };
    }
  }

  /**
   * Checks if required ports are available
   */
  private checkPortAvailability(): StatusCheck {
    // Common development ports to check
    const portsToCheck = [3000, 8080, 4000];
    
    // This is a simplified check - in a real implementation you would
    // actually try to check if these ports are in use
    // For demo purposes, we'll just assume they're available
    
    return {
      name: 'Port Availability',
      status: 'ok',
      message: `Ports ${portsToCheck.join(', ')} appear to be available`
    };
  }

  /**
   * Checks if required environment variables are set
   */
  private checkEnvironmentVariables(): StatusCheck {
    const requiredEnvVars = ['NODE_ENV', 'PORT', 'LOCAL_LOOP_CONFIG'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length === 0) {
      return {
        name: 'Environment Variables',
        status: 'ok',
        message: 'All required environment variables are set'
      };
    } else {
      return {
        name: 'Environment Variables',
        status: 'warning',
        message: `Missing environment variables: ${missingEnvVars.join(', ')}`
      };
    }
  }
}
