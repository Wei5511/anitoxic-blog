import { executeQuery } from '@/lib/database';
import SettingsForm from './settings-form';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const res = await executeQuery("SELECT value FROM settings WHERE key = 'next_public_ga_id'");
    const row = res.get ? res.get() : (res.rows ? res.rows[0] : null);
    const gaId = row ? row.value : '';

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>系統設定</h1>
            <SettingsForm initialGaId={gaId} />
        </div>
    );
}
