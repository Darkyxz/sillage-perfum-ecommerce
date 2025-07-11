#!/usr/bin/env node

/**
 * This script helps migrate hardcoded colors to theme variables.
 * It scans your components and suggests replacements for hardcoded colors.
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color mappings from hardcoded colors to theme variables
const COLOR_MAPPINGS = {
  // Amber/Gold colors
  'amber-50': 'primary-50',
  'amber-100': 'primary-100',
  'amber-200': 'primary-200',
  'amber-300': 'primary-300',
  'amber-400': 'primary-400',
  'amber-500': 'primary',
  'amber-600': 'primary-600',
  'amber-700': 'primary-700',
  'amber-800': 'primary-800',
  'amber-900': 'primary-900',
  
  // Gray/Neutral colors
  'gray-50': 'background',
  'gray-100': 'muted',
  'gray-200': 'muted',
  'gray-300': 'muted',
  'gray-400': 'muted-foreground',
  'gray-500': 'muted-foreground',
  'gray-600': 'foreground',
  'gray-700': 'foreground',
  'gray-800': 'foreground',
  'gray-900': 'foreground',
  
  // Red/Destructive colors
  'red-500': 'destructive',
  'red-600': 'destructive',
  'red-700': 'destructive',
  
  // Other common colors
  'white': 'background',
  'black': 'foreground',
  'current': 'current',
  'transparent': 'transparent',
  'inherit': 'inherit',
};

// File extensions to process
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Directories to scan
const SCAN_DIRS = [
  path.join(process.cwd(), 'src/components'),
  path.join(process.cwd(), 'src/pages'),
  path.join(process.cwd(), 'src/theme'),
];

// Utility to check if a file should be processed
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const shouldProcess = FILE_EXTENSIONS.includes(ext);
  
  // Skip node_modules, .next, dist, etc.
  const normalizedPath = filePath.replace(/\\/g, '/');
  const excludedDirs = ['/node_modules/', '/.next/', '/dist/', '/build/'];
  const isExcluded = excludedDirs.some(dir => normalizedPath.includes(dir));
  
  if (isExcluded) {
    console.log(`⏩ Excluded file: ${filePath}`);
    return false;
  }
  
  return shouldProcess;
};

// Replace color classes with theme variables
const replaceColorClasses = (content) => {
  let modified = false;
  let newContent = content;
  
  // Replace Tailwind color classes
  for (const [oldColor, newColor] of Object.entries(COLOR_MAPPINGS)) {
    const patterns = [
      // Background colors
      new RegExp(`(\\b)bg-${oldColor}(\\b|-)`, 'g'),
      // Text colors
      new RegExp(`(\\b)text-${oldColor}(\\b|-)`, 'g'),
      // Border colors
      new RegExp(`(\\b)border-${oldColor}(\\b|-)`, 'g'),
      // Ring colors
      new RegExp(`(\\b)ring-${oldColor}(\\b|-)`, 'g'),
      // Divide colors
      new RegExp(`(\\b)divide-${oldColor}(\\b|-)`, 'g'),
      // Outline colors
      new RegExp(`(\\b)outline-${oldColor}(\\b|-)`, 'g'),
      // From colors (for gradients)
      new RegExp(`(\\b)from-${oldColor}(\\b|-)`, 'g'),
      // Via colors (for gradients)
      new RegExp(`(\\b)via-${oldColor}(\\b|-)`, 'g'),
      // To colors (for gradients)
      new RegExp(`(\\b)to-${oldColor}(\\b|-)`, 'g'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(newContent)) {
        modified = true;
        newContent = newContent.replace(pattern, (match, p1, p2) => {
          return `${p1}${match.replace(oldColor, newColor)}${p2}`;
        });
      }
    }
  }
  
  return { modified, content: newContent };
};

// Process a single file
const processFile = async (filePath) => {
  try {
    const content = await readFile(filePath, 'utf8');
    const { modified, content: newContent } = replaceColorClasses(content);
    
    if (modified) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`✅ Updated ${path.relative(process.cwd(), filePath)}`);
    } else {
      console.log(`ℹ️  No changes needed for ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
};

// Recursively process a directory
const processDirectory = async (dirPath) => {
  try {
    console.log(`📁 Scanning directory: ${dirPath}`);
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    console.log(`Found ${entries.length} entries in ${dirPath}`);
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        console.log(`🔍 Entering subdirectory: ${fullPath}`);
        await processDirectory(fullPath);
      } else if (entry.isFile() && shouldProcessFile(fullPath)) {
        console.log(`📄 Processing file: ${fullPath}`);
        await processFile(fullPath);
      } else {
        console.log(`⏩ Skipping ${entry.isDirectory() ? 'directory' : 'file'}: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
    console.error(error.stack);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting theme migration...\n');
  
  // Process each directory
  for (const dir of SCAN_DIRS) {
    try {
      await fs.promises.access(dir);
      console.log(`📂 Processing directory: ${path.relative(process.cwd(), dir)}`);
      await processDirectory(dir);
    } catch (error) {
      console.log(`⚠️  Directory not found: ${dir}`);
    }
  }
  
  console.log('\n✨ Theme migration completed!');
  console.log('\nNext steps:');
  console.log('1. Review the changes made by this script');
  console.log('2. Test your application in both light and dark modes');
  console.log('3. Check for any visual regressions');
  console.log('4. Commit your changes');
};

// Run the script
main().catch(console.error);

export {};
