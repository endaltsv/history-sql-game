import { Lightbulb, CheckCircle } from "lucide-react";

export function HintsAndTips() {
  return (
    <div className="space-y-6">
      <div className="bg-amber-100/50 p-6 rounded-lg border border-amber-900/10">
        <h3 className="font-detective text-xl text-amber-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Investigation Tips
        </h3>
        <ul className="space-y-4">
          {[
            {
              title: "Check for NULL Values",
              description:
                "Use IS NULL to find records with missing information in critical fields.",
              example: "SELECT * FROM Orders WHERE ShipDate IS NULL;",
            },
            {
              title: "Join Multiple Tables",
              description:
                "Connect orders with customer information using JOIN operations.",
              example:
                "SELECT o.*, c.CompanyName FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID;",
            },
            {
              title: "Filter by Date Range",
              description:
                "Use BETWEEN operator to find orders within specific dates.",
              example:
                "SELECT * FROM Orders WHERE OrderDate BETWEEN '1998-03-01' AND '1998-04-30';",
            },
          ].map((tip, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-lg border border-amber-200"
            >
              <h4 className="font-detective text-amber-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-amber-700" />
                {tip.title}
              </h4>
              <p className="text-amber-800 mb-2 text-sm">{tip.description}</p>
              <pre className="bg-amber-50 p-2 rounded font-mono text-xs text-amber-800">
                {tip.example}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
