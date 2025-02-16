// app/routes/_index.jsx
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  MegaphoneIcon,
  PencilIcon,
  UserGroupIcon,
  BriefcaseIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-center py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Transform Your <span className="text-emerald-200">Freelance</span>{" "}
              Journey
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto">
              Bangladesh's premier platform connecting skilled professionals
              with global opportunities
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-emerald-50 transition-all"
              >
                Start Exploring →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-emerald-50 rounded-xl">
                <stat.icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
          >
            Why GigWorkBD Stands Out
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-16 w-16 text-emerald-500 mb-6" />
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Explore opportunities in Bangladesh's most in-demand fields
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <category.icon className="h-8 w-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-emerald-600 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Career?
            </h2>
            <p className="text-emerald-100 text-xl mb-8">
              Join thousands of successful freelancers and clients in
              Bangladesh's fastest growing marketplace
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-emerald-50 transition-all"
              >
                Get Started Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Local Payment Integration",
    description:
      "Secure transactions with bKash, Nagad, Rocket, and all major Bangladeshi banks.",
    icon: CurrencyBangladeshiIcon,
  },
  {
    title: "Verified Professionals",
    description:
      "NID-verified freelancers and company-verified clients for trust and safety.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Smart Escrow System",
    description:
      "Funds protected until project completion with automated milestone payments.",
    icon: CheckCircleIcon,
  },
];

const stats = [
  { number: "50K+", label: "Active Professionals", icon: UserGroupIcon },
  { number: "৳1B+", label: "Transaction Volume", icon: BanknotesIcon },
  { number: "95%", label: "Success Rate", icon: CheckCircleIcon },
  { number: "15K+", label: "Monthly Projects", icon: BriefcaseIcon },
];

const categories = [
  { name: "Web Development", icon: CodeBracketIcon },
  { name: "Mobile Apps", icon: ComputerDesktopIcon },
  { name: "Digital Marketing", icon: MegaphoneIcon },
  { name: "Content Writing", icon: PencilIcon },
];
