import { CheckCircle } from "lucide-react"

export function Career() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-6">
      <div className="max-w-2xl w-full text-justify">
        <h1 className="text-5xl font-bold mb-6 text-center">Join Our Team</h1>

        <p className="text-lg text-gray-700 dark:text-gray-300">
          At <span className="font-semibold">RDP Datacenter</span>, we strive to build innovative and scalable solutions.  
          Right now, we are <span className="font-semibold">not hiring</span> for any positions.
        </p>

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          However, if you believe you have exceptional skills and can bring value to our team,  
          we would love to hear from you.  
        </p>

        {/* Email Section */}
        <div className="text-center mt-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Feel free to send your resume and portfolio to
          </p>
          <a
            href="mailto:career@rdpdatacenter.in"
            className="relative text-amber-600 font-semibold transition ease-in duration-200 
             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
             after:bg-amber-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            career@rdpdatacenter.in
          </a>
        </div>

        {/* T&C Styled Points */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          <p className="mb-2 font-semibold">Please note:</p>
          <ul className="list-none space-y-2 text-left max-w-lg mx-auto">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-1" />
              Our team carefully reviews each application.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-1" />
              If your skills align with our vision, we’ll reach out to discuss potential opportunities.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-1" />
              We review applications on a rolling basis.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-1" />
              If there&apos;s a fit, we’ll get in touch!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
