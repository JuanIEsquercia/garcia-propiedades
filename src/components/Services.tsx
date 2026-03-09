
import styles from './Services.module.css';
import { Home, Key, MapPin, Search } from 'lucide-react';

const servicesList = [
    {
        icon: <Home size={32} />,
        title: 'Compra y Venta',
        description: 'Te asesoramos en todo el proceso de comercialización de tu inmueble con las mejores estrategias del mercado.',
        link: 'https://wa.me/5493794088400?text=Hola%20Garcia%20Propiedades%2C%20vengo%20de%20la%20web%20y%20quiero%20vender%20mi%20propiedad.',
        linkLabel: 'Quiero vender'
    },
    {
        icon: <Key size={32} />,
        title: 'Alquileres',
        description: 'Gestión integral de alquileres tanto para propietarios como para inquilinos. Garantizamos tranquilidad.',
        link: 'https://wa.me/5493794088400?text=Hola%20Garcia%20Propiedades%2C%20vengo%20de%20la%20web%20y%20estoy%20buscando%20alquiler.',
        linkLabel: 'Buscar alquiler'
    },
    {
        icon: <Search size={32} />,
        title: 'Tasaciones',
        description: 'Tasaciones profesionales y reales de acuerdo al valor actual de mercado de tu propiedad.',
        link: 'https://wa.me/5493794088400?text=Hola%20Garcia%20Propiedades%2C%20vengo%20de%20la%20web%20y%20me%20gustar%C3%ADa%20tasar%20mi%20inmueble.',
        linkLabel: 'Tasar mi propiedad'
    },
    {
        icon: <MapPin size={32} />,
        title: 'Emprendimientos',
        description: 'Gestión comercial integral de desarrollos, trabajos en red con otras inmobiliarias y creación de páginas web exclusivas para exhibir tu proyecto.',
        link: 'https://edentorre.com/',
        linkLabel: 'Ver casos de uso'
    }
];

const Services = () => {
    return (
        <section id="servicios" className={styles.servicesSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={`${styles.badge} animate-fade-in`}>Nuestros Servicios</div>
                    <h2 className={`${styles.title} animate-fade-in delay-100`}>
                        Soluciones inmobiliarias <br />
                        <span className="text-gradient">integrales</span>
                    </h2>
                    <p className={`${styles.subtitle} animate-fade-in delay-200`}>
                        Cubrimos todas tus necesidades en el mercado de bienes raíces con profesionalismo, transparencia y la mejor atención personalizada.
                    </p>
                </div>

                <div className={styles.grid}>
                    {servicesList.map((service, index) => (
                        <div
                            key={index}
                            className={`${styles.card} animate-fade-in`}
                            style={{ animationDelay: `${(index + 3) * 100}ms` }}
                        >
                            <div className={styles.iconWrapper}>
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDescription}>{service.description}</p>

                            {service.link && service.linkLabel && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <a href={service.link} target="_blank" rel="noopener noreferrer" className={styles.cardLinkBtn}>
                                        {service.linkLabel}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
