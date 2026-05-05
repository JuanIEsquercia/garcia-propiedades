import { useState, useEffect } from 'react';
import styles from './Properties.module.css';
import { MapPin, ExternalLink } from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeaturedProperty {
    id: string;
    title: string;
    price: string;
    location: string;
    imageUrl: string;
    linkUrl: string;
    operationType: string;
}

const Properties = () => {
    const [properties, setProperties] = useState<FeaturedProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'featured_properties'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const props = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FeaturedProperty[];
            setProperties(props);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <section id="propiedades" className={styles.propertiesSection}>
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <div className={`${styles.badge} animate-fade-in`}>Catálogo Propiedades</div>
                    <h2 className={`${styles.title} animate-fade-in delay-100`}>
                        Descubrí tu próximo <span className="text-gradient">hogar</span>
                    </h2>
                    <p className={`${styles.subtitle} animate-fade-in delay-200`}>
                        Propiedades seleccionadas para brindarte las mejores oportunidades de inversión y vivienda en Corrientes y la región.
                    </p>
                </div>

                {loading && (
                    <div className={styles.loadingGrid}>
                        {[...Array(3)].map((_, i) => <div key={i} className={styles.skeleton} />)}
                    </div>
                )}

                {!loading && properties.length > 0 && (
                    <div className={`${styles.propertiesGrid} animate-fade-in delay-300`}>
                        {properties.map(property => {
                            const CardTag = property.linkUrl ? 'a' : 'div';
                            const cardProps = property.linkUrl
                                ? { href: property.linkUrl, target: '_blank', rel: 'noopener noreferrer' }
                                : {};
                            return (
                                <CardTag key={property.id} className={styles.propertyCard} {...(cardProps as any)}>
                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src={property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                                            alt={property.title}
                                            className={styles.cardImage}
                                            loading="lazy"
                                        />
                                        {property.operationType && (
                                            <span className={styles.operationBadge}>{property.operationType}</span>
                                        )}
                                    </div>
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardTitle}>{property.title}</p>
                                        <p className={styles.cardPrice}>{property.price}</p>
                                        <p className={styles.cardLocation}>
                                            <MapPin size={13} />
                                            {property.location}
                                        </p>
                                    </div>
                                </CardTag>
                            );
                        })}
                    </div>
                )}

                <div className={`${styles.viewAllWrapper} animate-fade-in delay-300`}>
                    <a
                        href="https://www.inmogp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.primaryBtn}
                    >
                        Ver todas las propiedades
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Properties;
