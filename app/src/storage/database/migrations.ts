import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
    migrations: [
        // Example migration for future schema changes:
        // {
        //   toVersion: 2,
        //   steps: [
        //     addColumns({
        //       table: 'houses',
        //       columns: [
        //         { name: 'new_field', type: 'string', isOptional: true },
        //       ],
        //     }),
        //   ],
        // },
    ],
});
