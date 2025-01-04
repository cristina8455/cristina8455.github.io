import { config } from 'dotenv';
import { resolve } from 'path';
import { runBuildTimeSync } from './canvas-sync';
import { CourseMapping } from './types';

// Load environment variables from .env.local
config({
    path: resolve(process.cwd(), '.env.local')
});

// Parse course mappings
let courseMappings: CourseMapping[] = [];
try {
    courseMappings = JSON.parse(process.env.COURSE_MAPPINGS || '[]');
} catch (error) {
    console.error('Failed to parse COURSE_MAPPINGS:', error);
    process.exit(1);
}

// Verify environment variables are loaded
console.log('Checking environment variables...');
console.log('Canvas Base URL:', process.env.CANVAS_BASE_URL ? 'Found' : 'Missing');
console.log('Canvas API Token:', process.env.CANVAS_API_TOKEN ? 'Found' : 'Missing');
console.log('Sync Course IDs:', process.env.SYNC_COURSE_IDS ? 'Found' : 'Missing');
console.log('Course Mappings:', courseMappings.length > 0 ? 'Found' : 'Missing');

// Run the sync with mappings
runBuildTimeSync({ courseMappings })
    .then(() => {
        console.log('Sync completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Sync failed:', error);
        process.exit(1);
    });