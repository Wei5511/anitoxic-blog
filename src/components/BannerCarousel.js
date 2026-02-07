'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function BannerCarousel() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const timeoutRef = useRef(null);

    // Fetch banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners');
                const data = await res.json();
                if (data.success) {
                    setBanners(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-play logic
    useEffect(() => {
        if (banners.length <= 1) return;

        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        };

        timeoutRef.current = setTimeout(nextSlide, 5000); // 5 seconds per slide

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, banners.length]);

    if (loading || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    // Handlers
    const goToSlide = (index) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setCurrentIndex(index);
    };

    return (
        <div style={styles.container}>
            <div style={styles.carouselWrapper}>
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        style={{
                            ...styles.slide,
                            opacity: index === currentIndex ? 1 : 0,
                            pointerEvents: index === currentIndex ? 'auto' : 'none',
                        }}
                    >
                        {banner.link ? (
                            <Link href={banner.link} target="_blank" style={styles.link}>
                                <img
                                    src={banner.image_url}
                                    alt={banner.title || 'Banner'}
                                    style={styles.image}
                                />
                            </Link>
                        ) : (
                            <img
                                src={banner.image_url}
                                alt={banner.title || 'Banner'}
                                style={styles.image}
                            />
                        )}
                    </div>
                ))}

                {/* Navigation Dots */}
                {banners.length > 1 && (
                    <div style={styles.dotsContainer}>
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                style={{
                                    ...styles.dot,
                                    background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                    transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        marginBottom: '2rem',
    },
    carouselWrapper: {
        position: 'relative',
        width: '100%',
        paddingBottom: '33.33%', // 3:1 Aspect Ratio (adjust as needed, e.g. 25% for 4:1)
        backgroundColor: '#f0f0f0',
        borderRadius: '16px', // Rounded corners as requested
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    slide: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'opacity 0.5s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        display: 'block',
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: 0,
    },
};
