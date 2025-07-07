export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              Explore.pe
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
              <p className="mb-4">
                Recopilamos información que usted nos proporciona directamente, incluyendo:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Ubicación</li>
                <li>Fotografías que usted carga</li>
                <li>Información de perfil y servicios ofrecidos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
              <p className="mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Facilitar la conexión entre turistas y guías</li>
                <li>Mostrar perfiles y listados en la plataforma</li>
                <li>Comunicarnos con usted sobre su cuenta</li>
                <li>Mejorar nuestros servicios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="font-semibold">
                  Su información de perfil es pública y puede ser vista por todos los usuarios del sitio.
                </p>
              </div>
              <p className="mb-4">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Cuando sea requerido por ley</li>
                <li>Para proteger nuestros derechos o propiedad</li>
                <li>Con su consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Seguridad</h2>
              <p className="mb-4">
                Implementamos medidas de seguridad razonables para proteger su información. 
                Sin embargo, ningún método de transmisión por Internet es 100% seguro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Sus Derechos</h2>
              <p className="mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de su cuenta</li>
                <li>Oponerse al procesamiento de sus datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p className="mb-4">
                Utilizamos cookies para mejorar su experiencia en el sitio. 
                Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cambios a esta Política</h2>
              <p className="mb-4">
                Podemos actualizar esta política periódicamente. 
                Le notificaremos sobre cambios significativos publicando la nueva política en esta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
              <p className="mb-4">
                Si tiene preguntas sobre esta Política de Privacidad, contáctenos en:
                <br />
                Email: info@explore.pe
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              Desarrollado por VRG Market Solutions | Todos los derechos reservados © 2025
            </p>
            <div className="flex gap-6">
              <a href="/terms" className="text-gray-300 hover:text-white text-sm">
                Términos de Servicio
              </a>
              <a href="/privacy" className="text-gray-300 hover:text-white text-sm">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}