import styles from './Properties.module.css';
import { ExternalLink, Home } from 'lucide-react';

const Properties = () => {
    return (
        <section id="propiedades" className={styles.propertiesSection}>
            <div className={`container ${styles.container}`}>
                <div className={styles.contentWrapper}>
                    <div className={`${styles.badge} animate-fade-in`}>Catálogo Propiedades</div>
                    <h2 className={`${styles.title} animate-fade-in delay-100`}>
                        Descubrí tu próximo <span className="text-gradient">hogar</span>
                    </h2>
                    <p className={`${styles.subtitle} animate-fade-in delay-200`}>
                        Contamos con un amplio y exclusivo catálogo de propiedades seleccionadas para brindarte las mejores oportunidades de inversión y vivienda. Explorá todas nuestras opciones en el portal principal.
                    </p>

                    <div className={`${styles.actionContainer} animate-fade-in delay-300`}>
                        <div className={styles.actionCard}>
                            <div className={styles.actionIconWrapper}>
                                <Home size={40} className={styles.actionIcon} />
                            </div>
                            <h3>Ir a nuestro buscador oficial</h3>
                            <p>Visualizá fotos, recorridos, descripciones y precios actualizados de todas nuestras propiedades disponibles.</p>
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
                </div>
            </div>
        </section>
    );
};

export default Properties;
