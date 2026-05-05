
import { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { ArrowRight, Building } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeaturedProperty {
    imageUrl: string;
    price: string;
    location: string;
    title: string;
    linkUrl?: string;
}

const Hero = () => {
    const [property, setProperty] = useState<FeaturedProperty | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'hero_property'), (snap) => {
            if (snap.exists()) {
                setProperty(snap.data() as FeaturedProperty);
            }
        });
        return () => unsub();
    }, []);

    return (
        <section id="inicio" className={styles.heroSection}>
            <div className={styles.glowingOrb1}></div>
            <div className={styles.glowingOrb2}></div>

            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                    <div className={`${styles.badge} animate-fade-in`}>
                        <span className={styles.badgeDot}></span>
                        Innovación en Bienes Raíces
                    </div>

                    <h1 className={`${styles.title} animate-fade-in delay-100`}>
                        Encontrá el lugar perfecto con <br />
                        <span className="text-gradient">Garcia Propiedades</span>
                    </h1>

                    <p className={`${styles.subtitle} animate-fade-in delay-200`}>
                        Combinamos años de experiencia con tecnología de vanguardia para
                        ofrecerte la mejor asesoría en el mercado inmobiliario. Tu próximo hogar, a un click de distancia.
                    </p>

                    <div className={`${styles.ctaGroup} animate-fade-in delay-300`}>
                        <a href="https://www.inmogp.com/" target="_blank" rel="noopener noreferrer" className={styles.primaryBtn} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            Ver Propiedades
                            <ArrowRight size={20} className={styles.btnIcon} />
                        </a>
                        <a href="https://wa.me/5493794088400?text=Hola%20Garcia%20Propiedades%2C%20vengo%20de%20la%20web%20y%20me%20gustar%C3%ADa%20vender%20o%20tasar%20mi%20inmueble." target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Building size={20} />
                            Vender o Tasar
                        </a>
                    </div>


                </div>

                <div className={`${styles.heroImageWrapper} animate-fade-in delay-200`}>
                    <div className={styles.glassFrame}>
                        {property === null ? (
                            <div className={styles.logoBanner}>
                                <div className={styles.logoIconWrapper}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div className={styles.logoName}>GARCIA</div>
                                <div className={styles.logoSub}>PROPIEDADES</div>
                                <div className={styles.logoDivider}></div>
                                <div className={styles.logoTagline}>Corrientes, Argentina</div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.imageOverlay}></div>
                                <img
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className={styles.heroImage}
                                />
                                {property.linkUrl ? (
                                    <a href={property.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.floatingCard} style={{ textDecoration: 'none' }}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.pulseIndicator}></div>
                                            {property.title}
                                        </div>
                                        <div className={styles.cardPrice}>{property.price}</div>
                                        <div className={styles.cardLocation}>{property.location}</div>
                                    </a>
                                ) : (
                                    <div className={styles.floatingCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.pulseIndicator}></div>
                                            {property.title}
                                        </div>
                                        <div className={styles.cardPrice}>{property.price}</div>
                                        <div className={styles.cardLocation}>{property.location}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
