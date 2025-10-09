#!/usr/bin/env node

// scripts/migrate-colors.js
// Automated color migration script for DKL25 frontend

const fs = require('fs');
const path = require('path');

// Color mappings - from hardcoded hex to Tailwind classes
const colorMappings = {
  // Primary brand colors
  '#ff9328': {
    // Direct classes
    'bg-': 'bg-primary',
    'text-': 'text-primary',
    'border-': 'border-primary',
    'ring-': 'ring-primary',
    'after:bg-': 'after:bg-primary',
    'focus:ring-': 'focus:ring-primary',
    'focus:border-': 'focus:border-primary',
    'peer-checked:border-': 'peer-checked:border-primary',
    'peer-checked:bg-': 'peer-checked:bg-primary',
    'hover:bg-': 'hover:bg-primary',
    'hover:text-': 'hover:text-primary',
    'active:bg-': 'active:bg-primary'
  },

  // Primary dark (standardize hover states)
  '#e67f1c': {
    'bg-': 'bg-primary-dark',
    'text-': 'text-primary-dark',
    'border-': 'border-primary-dark',
    'ring-': 'ring-primary-dark',
    'hover:bg-': 'hover:bg-primary-dark',
    'hover:text-': 'hover:text-primary-dark',
    'active:bg-': 'active:bg-primary-dark'
  },

  // Fix inconsistent hover states
  '#e87f1c': {
    'bg-': 'bg-primary-dark',
    'text-': 'text-primary-dark',
    'border-': 'border-primary-dark',
    'ring-': 'ring-primary-dark',
    'hover:bg-': 'hover:bg-primary-dark',
    'hover:text-': 'hover:text-primary-dark',
    'active:bg-': 'active:bg-primary-dark'
  },

  // Fix active state
  '#d97919': {
    'bg-': 'bg-primary-dark',
    'text-': 'text-primary-dark',
    'border-': 'border-primary-dark',
    'ring-': 'ring-primary-dark',
    'hover:bg-': 'hover:bg-primary-dark',
    'hover:text-': 'hover:text-primary-dark',
    'active:bg-': 'active:bg-primary-dark'
  },

  // Social media colors
  '#1877F2': {
    'hover:bg-': 'hover:bg-social-facebook'
  },

  '#E4405F': {
    'hover:bg-': 'hover:bg-social-instagram'
  },

  '#FF0000': {
    'hover:bg-': 'hover:bg-social-youtube'
  },

  '#0A66C2': {
    'hover:bg-': 'hover:bg-social-linkedin'
  }
};

// Files to process
const filesToProcess = [
  // High priority components
  'src/pages/Aanmelden/components/FormContainer.tsx',
  'src/pages/Aanmelden/components/SuccessMessage.tsx',
  'src/components/Title/TitleSection.tsx',
  'src/components/Radiogallerij/RadioPlayer.tsx',
  'src/components/Radiogallerij/RadioGallery.tsx',

  // Medium priority components
  'src/components/modals/ContactModal.tsx',
  'src/components/LoadingScreen.tsx',
  'src/components/icons/generateIcons.ts',

  // Low priority components
  'src/components/footer/data.ts',
  'src/components/Navbar/constants.ts',
  'src/components/Socials/DKLSocials.tsx',

  // Email templates
  'src/utils/emailTemplates.ts'
];

let totalFilesChanged = 0;
let totalReplacements = 0;

function migrateColorsInFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    let fileChanged = false;
    let fileReplacements = 0;

    // Process each color mapping
    Object.entries(colorMappings).forEach(([hexColor, replacements]) => {
      Object.entries(replacements).forEach(([oldPattern, newClass]) => {
        // Create regex pattern for the old class
        // Handle patterns like 'after:bg-', 'focus:ring-', etc.
        const escapedPattern = oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`${escapedPattern}\\[${hexColor}\\]`, 'g');

        if (regex.test(content)) {
          content = content.replace(regex, newClass);
          fileChanged = true;
          fileReplacements++;
          totalReplacements++;
        }
      });
    });

    // Special handling for data objects (like footer data)
    if (filePath.includes('data.ts') || filePath.includes('constants.ts')) {
      Object.entries(colorMappings).forEach(([hexColor, replacements]) => {
        // Look for social media colors in data files
        const socialReplacements = Object.entries(replacements).filter(([key, value]) =>
          value.includes('social-')
        );

        socialReplacements.forEach(([pattern, newClass]) => {
          const regex = new RegExp(`'${pattern.replace('hover:bg-', 'hover:bg')}\\[${hexColor}\\]'`, 'g');
          const replacement = `'${newClass}'`;

          if (regex.test(content)) {
            content = content.replace(regex, replacement);
            fileChanged = true;
            fileReplacements++;
            totalReplacements++;
          }
        });
      });
    }

    // Special handling for email templates (inline styles)
    if (filePath.includes('emailTemplates.ts')) {
      Object.entries(colorMappings).forEach(([hexColor, replacements]) => {
        const regex = new RegExp(hexColor, 'g');
        if (regex.test(content)) {
          // For email templates, we'll use a placeholder that can be replaced with a constant
          content = content.replace(regex, `\${colorTokens.primary.base}`);
          fileChanged = true;
          fileReplacements++;
          totalReplacements++;
        }
      });
    }

    if (fileChanged) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Migrated ${fileReplacements} colors in ${filePath}`);
      totalFilesChanged++;
    } else {
      console.log(`ℹ️  No changes needed in ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function updateTailwindConfig() {
  try {
    const configPath = path.resolve('tailwind.config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Check if social colors are already defined
    if (!configContent.includes('social-facebook')) {
      // Add social colors to the config
      const socialColorsAddition = `,
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          youtube: '#FF0000',
          linkedin: '#0A66C2',
        }`;

      // Find the primary color definition and add social colors after it
      const primaryRegex = /(primary:\s*{\s*DEFAULT:\s*'#[0-9a-fA-F]{6}',\s*dark:\s*'#[0-9a-fA-F]{6}',\s*light:\s*'#[0-9a-fA-F]{6}',\s*})/;
      configContent = configContent.replace(primaryRegex, `$1${socialColorsAddition}`);

      fs.writeFileSync(configPath, configContent, 'utf8');
      console.log('✅ Updated tailwind.config.js with social colors');
    } else {
      console.log('ℹ️  Social colors already defined in tailwind.config.js');
    }

  } catch (error) {
    console.error('❌ Error updating tailwind.config.js:', error.message);
  }
}

function createColorConstants() {
  try {
    const constantsPath = path.resolve('src/styles/colors.ts');

    if (!fs.existsSync(constantsPath)) {
      const colorConstants = `// src/styles/colors.ts
// Color tokens for consistent usage across the application

export const colorTokens = {
  // Primary brand colors
  primary: {
    base: '#ff9328',
    dark: '#e67f1c',
    light: '#ffad5c',
  },

  // Social media colors
  social: {
    facebook: '#1877F2',
    instagram: '#E4405F',
    youtube: '#FF0000',
    linkedin: '#0A66C2',
  },

  // Status colors
  status: {
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
    info: '#2563eb',
  }
} as const

// Tailwind class mappings for components
export const colorClasses = {
  primary: {
    bg: 'bg-primary',
    hover: 'hover:bg-primary-dark',
    text: 'text-primary',
    border: 'border-primary',
    focus: 'focus:ring-primary',
  },

  social: {
    facebook: 'hover:bg-social-facebook',
    instagram: 'hover:bg-social-instagram',
    youtube: 'hover:bg-social-youtube',
    linkedin: 'hover:bg-social-linkedin',
  }
} as const

// Type definitions
export type ColorToken = keyof typeof colorTokens
export type PrimaryColor = keyof typeof colorTokens.primary
export type SocialColor = keyof typeof colorTokens.social
export type StatusColor = keyof typeof colorTokens.status
`;

      // Ensure directory exists
      const dir = path.dirname(constantsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(constantsPath, colorConstants, 'utf8');
      console.log('✅ Created src/styles/colors.ts with color constants');
    } else {
      console.log('ℹ️  Color constants file already exists');
    }

  } catch (error) {
    console.error('❌ Error creating color constants:', error.message);
  }
}

function validateMigration() {
  console.log('\n🔍 Validating migration...');

  let remainingHardcodedColors = 0;

  filesToProcess.forEach(filePath => {
    try {
      const fullPath = path.resolve(filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check for remaining hardcoded colors
        Object.keys(colorMappings).forEach(hexColor => {
          const regex = new RegExp(hexColor, 'g');
          const matches = content.match(regex);
          if (matches) {
            remainingHardcodedColors += matches.length;
            console.log(`⚠️  ${matches.length} remaining instances of ${hexColor} in ${filePath}`);
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error validating ${filePath}:`, error.message);
    }
  });

  if (remainingHardcodedColors === 0) {
    console.log('✅ Migration validation passed - no hardcoded colors remaining!');
  } else {
    console.log(`⚠️  Migration validation found ${remainingHardcodedColors} remaining hardcoded colors`);
  }
}

// Main execution
console.log('🎨 Starting DKL25 Color Migration...\n');

console.log('📝 Step 1: Creating color constants...');
createColorConstants();

console.log('\n🔧 Step 2: Updating Tailwind config...');
updateTailwindConfig();

console.log('\n🎨 Step 3: Migrating colors in components...');
filesToProcess.forEach(migrateColorsInFile);

console.log('\n📊 Migration Summary:');
console.log(`   Files changed: ${totalFilesChanged}`);
console.log(`   Total replacements: ${totalReplacements}`);

validateMigration();

console.log('\n🎉 Color migration completed!');
console.log('\n📋 Next steps:');
console.log('   1. Run your build to check for any TypeScript errors');
console.log('   2. Test all components visually to ensure colors render correctly');
console.log('   3. Run accessibility checks to ensure contrast ratios are maintained');
console.log('   4. Update any remaining hardcoded colors manually if needed');

console.log('\n📚 Documentation:');
console.log('   See COLOR_MIGRATION_GUIDE.md for detailed migration information');