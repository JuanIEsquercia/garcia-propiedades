
import styles from './Location.module.css';
import { MapPin, Phone as PhoneIcon, Clock } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
);

const Location = () => {
    return (
        <section id="contacto" className={styles.locationSection}>
            <div className={`container ${styles.container}`}>
                <div className={styles.infoColumn}>
                    <div className={styles.badge}>Dónde Estamos</div>
                    <h2 className={styles.title}>
                        Encontranos en nuestra <span className="text-gradient">oficina</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Nos encontramos en Mendoza 1055, en pleno centro de la ciudad. Contamos con estacionamiento en cochera propia para los clientes que visitan la inmobiliaria.
                    </p>

                    <div className={styles.contactCards}>
                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}><MapPin /></div>
                            <div>
                                <h4>Dirección</h4>
                                <p>Mendoza 1055<br />Corrientes Capital, Argentina</p>
                            </div>
                        </div>

                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}><PhoneIcon /></div>
                            <div>
                                <h4>WhatsApp</h4>
                                <p>
                                    <a href="https://wa.me/5493794088400" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        +54 9 379 408-8400
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}><InstagramIcon /></div>
                            <div>
                                <h4>Instagram</h4>
                                <p>
                                    <a href="https://www.instagram.com/gpropiedades/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        @gpropiedades
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className={styles.contactCard}>
                            <div className={styles.iconWrapper}><Clock /></div>
                            <div>
                                <h4>Horarios</h4>
                                <p>Lunes a Viernes: 9:00 - 18:00 hs<br />Sábados: 9:00 - 13:00 hs</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.mapColumn}>
                    <div className={styles.mapFrame}>
                        <iframe
                            src="https://maps.google.com/maps?q=Mendoza%201055,%20Corrientes,%20Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '16px', filter: 'contrast(1.1)' }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa de Ubicación Garcia Propiedades"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
