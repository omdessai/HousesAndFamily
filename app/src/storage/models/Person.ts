import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Person extends Model {
    static table = 'people';

    @field('name') name!: string;
    @date('birth_date') birthDate!: Date | null;
    @field('avatar_uri') avatarUri!: string | null;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}
