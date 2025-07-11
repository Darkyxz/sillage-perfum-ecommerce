#!/usr/bin/env node

/**
 * This script updates package.json with theme-related dependencies and scripts.
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required dependencies for the theme system
const REQUIRED_DEPENDENCIES = {
  'tailwindcss': '^3.3.0',
  'postcss': '^8.4.0',
  'autoprefixer': '^10.4.0',
  'clsx': '^2.0.0',
  'tailwind-merge': '^1.14.0',
  'tailwindcss-animate': '^1.0.0',
};

// Required dev dependencies
const REQUIRED_DEV_DEPENDENCIES = {
  '@types/node': '^18.0.0',
  '@types/react': '^18.0.0',
  '@types/react-dom': '^18.0.0',
  'typescript': '^5.0.0',
};

// Scripts to add to package.json
const SCRIPTS = {
  'theme:check': 'node scripts/check-theme.js',
  'theme:update': 'node scripts/update-theme.js',
  'theme:migrate': 'node scripts/migrate-theme.js',
};

// Main function
const main = async () => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
    
    console.log('🔄 Updating package.json...');
    
    // Add dependencies
    packageJson.dependencies = {
      ...REQUIRED_DEPENDENCIES,
      ...(packageJson.dependencies || {}),
    };
    
    // Add dev dependencies
    packageJson.devDependencies = {
      ...REQUIRED_DEV_DEPENDENCIES,
      ...(packageJson.devDependencies || {}),
    };
    
    // Add scripts
    packageJson.scripts = {
      ...(packageJson.scripts || {}),
      ...SCRIPTS,
    };
    
    // Write the updated package.json
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf8'
    );
    
    console.log('✅ Successfully updated package.json');
    console.log('\nNext steps:');
    console.log('1. Run `npm install` or `yarn` to install the new dependencies');
    console.log('2. Run `npm run theme:migrate` to migrate your components to use the new theme system');
    console.log('3. Review the changes and test your application');
    
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
    process.exit(1);
  }
};

// Run the script
main().catch(console.error);

export {};
