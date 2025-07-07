export default function Terms() {
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
          <h1 className="text-3xl font-bold mb-8">Términos de Servicio</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p className="mb-4">
                Al acceder y utilizar Explore.pe ("el Sitio"), usted acepta estar sujeto a estos Términos de Servicio. 
                Si no está de acuerdo con estos términos, no debe utilizar este sitio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
              <p className="mb-4">
                Explore.pe es una plataforma de intermediación que conecta turistas con guías turísticos en Perú. 
                El Sitio actúa únicamente como un medio de conexión y no es responsable de los servicios prestados 
                por los guías turísticos ni de las experiencias compartidas por los turistas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Exención de Responsabilidad</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="font-semibold mb-2">IMPORTANTE:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Explore.pe NO verifica, valida ni garantiza la veracidad, exactitud o confiabilidad de la información proporcionada por los usuarios.</li>
                  <li>NO verificamos las credenciales, certificaciones o identidades de los guías turísticos.</li>
                  <li>NO actuamos como agentes, representantes o empleadores de ningún guía turístico o usuario.</li>
                  <li>NO somos responsables de ningún acuerdo, transacción o disputa entre usuarios.</li>
                </ul>
              </div>
              <p className="mb-4">
                El uso de este sitio y cualquier interacción con otros usuarios es bajo su propio riesgo. 
                Explore.pe no será responsable por ningún daño, pérdida, lesión, fraude, estafa o cualquier 
                otro perjuicio que pueda sufrir como resultado del uso del sitio o de las interacciones con otros usuarios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Limitación de Responsabilidad</h2>
              <p className="mb-4">
                En ningún caso Explore.pe, sus propietarios, empleados, afiliados o socios serán responsables por:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Daños directos, indirectos, incidentales, especiales o consecuentes</li>
                <li>Pérdida de ingresos, ganancias o datos</li>
                <li>Lesiones personales o daños a la propiedad</li>
                <li>Actos criminales, fraudes o estafas perpetrados por otros usuarios</li>
                <li>Información falsa o engañosa publicada por usuarios</li>
                <li>Calidad, seguridad o legalidad de los servicios ofrecidos</li>
                <li>Incumplimiento de acuerdos entre usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Responsabilidad del Usuario</h2>
              <p className="mb-4">
                Como usuario, usted es el único responsable de:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Verificar la identidad, credenciales y referencias de otros usuarios</li>
                <li>Evaluar la idoneidad y seguridad de cualquier servicio o actividad</li>
                <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                <li>La veracidad y exactitud de la información que proporciona</li>
                <li>Sus interacciones y transacciones con otros usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Indemnización</h2>
              <p className="mb-4">
                Usted acepta indemnizar, defender y mantener indemne a Explore.pe, sus propietarios, empleados y afiliados 
                de cualquier reclamo, demanda, pérdida, daño, costo o gasto (incluyendo honorarios legales) que surjan de:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Su uso del sitio</li>
                <li>Su violación de estos términos</li>
                <li>Su violación de cualquier ley o derecho de terceros</li>
                <li>Cualquier disputa o problema con otros usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contenido del Usuario</h2>
              <p className="mb-4">
                Los usuarios son los únicos responsables del contenido que publican. Explore.pe no revisa, 
                verifica ni respalda ningún contenido publicado por los usuarios. Nos reservamos el derecho 
                de eliminar cualquier contenido a nuestra discreción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Privacidad</h2>
              <p className="mb-4">
                El uso de nuestro sitio está sujeto a nuestra <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Modificaciones</h2>
              <p className="mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                El uso continuado del sitio después de dichas modificaciones constituye su aceptación de los nuevos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Ley Aplicable</h2>
              <p className="mb-4">
                Estos términos se regirán e interpretarán de acuerdo con las leyes de Perú. 
                Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción 
                exclusiva de los tribunales de Lima, Perú.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contacto</h2>
              <p className="mb-4">
                Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos en:
                <br />
                Email: legal@explore.pe
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