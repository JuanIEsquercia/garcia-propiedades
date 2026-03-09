
import styles from './AboutUs.module.css';
import { Target, Shield, Award } from 'lucide-react';

const AboutUs = () => {
    return (
        <section id="nosotros" className={styles.aboutSection}>
            <div className={`container ${styles.container}`}>
                <div className={styles.imageColumn}>
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                        alt="Oficina Garcia Propiedades"
                        className={styles.mainImage}
                    />
                    <div className={styles.experienceBadge}>
                        <span className={styles.years}>5+</span>
                        <span className={styles.text}>Años de<br />Experiencia</span>
                    </div>
                </div>

                <div className={styles.contentColumn}>
                    <div className={styles.badge}>Quiénes Somos</div>
                    <h2 className={styles.title}>
                        Tu confianza es nuestro capital más <span className="text-gradient-primary">valioso</span>
                    </h2>
                    <p className={styles.description}>
                        Te acompañamos en cada paso de tu decisión. Ya sea para vender, alquilar o encontrar tu próximo lugar, estamos con vos para asesorarte de forma clara, cercana y transparente. Queremos que tu experiencia inmobiliaria sea simple y segura.
                    </p>

                    <div className={styles.valuesList}>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}><Shield size={24} /></div>
                            <div>
                                <h4 className={styles.valueTitle}>Transparencia</h4>
                                <p className={styles.valueText}>Operaciones claras y seguras en todo momento.</p>
                            </div>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}><Target size={24} /></div>
                            <div>
                                <h4 className={styles.valueTitle}>Eficacia</h4>
                                <p className={styles.valueText}>Resultados rápidos que superan tus expectativas.</p>
                            </div>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}><Award size={24} /></div>
                            <div>
                                <h4 className={styles.valueTitle}>Experiencia</h4>
                                <p className={styles.valueText}>Conocimiento profundo del mercado local.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
