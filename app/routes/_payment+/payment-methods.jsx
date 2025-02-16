import { Form, useLoaderData } from "@remix-run/react";
import {
  CreditCardIcon,
  BanknotesIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    paymentMethods: [
      {
        id: "1",
        type: "card",
        last4: "4242",
        brand: "Visa",
        expiry: "12/25",
        isDefault: true,
      },
      {
        id: "2",
        type: "mobile",
        provider: "bKash",
        number: "017XX-XXXXXX",
      },
    ],
    stats: {
      totalMethods: 2,
      defaultMethod: "Visa •••• 4242",
      balance: 25000,
    },
  };
}

export default function PaymentMethods() {
  const { paymentMethods, stats } = useLoaderData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <BanknotesIcon className="h-8 w-8 text-emerald-600 mr-3" />
          Payment Methods
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={CreditCardIcon}
          title="Total Methods"
          value={stats.totalMethods}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Default Method"
          value={stats.defaultMethod}
        />
        <StatCard
          icon={BanknotesIcon}
          title="Wallet Balance"
          value={`৳${stats.balance.toLocaleString()}`}
        />
      </div>

      {/* Saved Payment Methods */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="add-method"
              className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add New Method
            </button>
          </Form>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {method.type === "card" ? (
                  <CreditCardIcon className="h-8 w-8 text-emerald-600" />
                ) : (
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    ৳
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {method.type === "card" ? (
                      <>
                        {method.brand} •••• {method.last4}
                        {method.isDefault && (
                          <span className="ml-2 text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </>
                    ) : (
                      `${method.provider} (${method.number})`
                    )}
                  </div>
                  {method.type === "card" && (
                    <div className="text-sm text-gray-500">
                      Expires {method.expiry}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <Form method="post">
                    <input type="hidden" name="methodId" value={method.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="set-default"
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Set Default
                    </button>
                  </Form>
                )}
                <Form method="post">
                  <input type="hidden" name="methodId" value={method.id} />
                  <button
                    type="submit"
                    name="_action"
                    value="delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Method Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Add Payment Method</h2>
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                name="cardNumber"
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  name="expiry"
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  name="cvc"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="defaultMethod"
              id="defaultMethod"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="defaultMethod" className="text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="reset"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              name="_action"
              value="add-card"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              Save Payment Method
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900 line-clamp-1">
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
}
