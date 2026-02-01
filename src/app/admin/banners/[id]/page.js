import { executeQuery } from '@/lib/database';
import BannerForm from '../banner-form';

export default async function EditBannerPage({ params }) {
    const { id } = await params;
    let banner = null;

    if (id !== 'new') {
        const res = await executeQuery('SELECT * FROM banners WHERE id = ?', [id]);
        banner = res.get ? res.get() : res.rows[0];
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {id === 'new' ? '新增橫幅' : '編輯橫幅'}
            </h1>
            <BannerForm banner={banner} />
        </div>
    );
}
