// import { useLoaderData, useActionData, Form } from "@remix-run/react";
// import { json, redirect } from "@remix-run/node";
// import { getUserById, updateUser } from "~/models/user.server";
// import { authenticator } from "~/services/auth.server";
// import {
//   UserCircleIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   BriefcaseIcon,
//   CurrencyBangladeshiIcon,
//   LockClosedIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";
// import { z } from "zod";
// import { useEffect, useState } from "react";
// import { XMarkIcon } from "@heroicons/react/20/solid";

// const ProfileSchema = z.object({
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().optional(),
//   avatar: z.string().optional(),
//   bio: z.string().optional(),
//   skills: z.array(z.string()).optional(),
//   company: z.string().optional(),
//   hourlyRate: z.number().optional(),
// });

// export async function loader({ request }) {
//   import { redirect } from "@remix-run/react";
//   const user = await authenticator.isAuthenticated(request, {
//     failureRedirect: "/login",
//   });

//   return json({ user });
// }

// export async function action({ request }) {
//   const formData = await request.formData();
//   const user = await authenticator.isAuthenticated(request);

//   try {
//     const values = ProfileSchema.parse(Object.fromEntries(formData));
//     const updatedUser = await updateUser(user.id, values);
//     return json({ success: true, user: updatedUser });
//   } catch (error) {
//     return json({ error: error.errors }, { status: 400 });
//   }
// }

// export default function EditProfile() {
//   const { user } = useLoaderData();
//   const actionData = useActionData();
//   const [skills, setSkills] = useState(user.skills || []);
//   const [inputSkill, setInputSkill] = useState("");

//   const addSkill = (e) => {
//     e.preventDefault();
//     if (inputSkill.trim() && !skills.includes(inputSkill.trim())) {
//       setSkills([...skills, inputSkill.trim()]);
//       setInputSkill("");
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     setSkills(skills.filter((skill) => skill !== skillToRemove));
//   };

//   useEffect(() => {
//     if (actionData?.success) {
//       // Show success toast/notification
//     }
//   }, [actionData]);

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <Form
//         method="post"
//         className="bg-white rounded-xl shadow-lg p-8 space-y-8"
//       >
//         <h1 className="text-2xl font-bold flex items-center">
//           <UserCircleIcon className="h-8 w-8 text-emerald-600 mr-3" />
//           Edit Profile
//         </h1>

//         {/* Personal Information */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold border-b pb-2">
//             Personal Information
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <input
//                 name="firstName"
//                 defaultValue={user.firstName}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <input
//                 name="lastName"
//                 defaultValue={user.lastName}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <div className="flex items-center">
//                 <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
//                 <input
//                   name="email"
//                   type="email"
//                   defaultValue={user.email}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <div className="flex items-center">
//                 <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
//                 <input
//                   name="phone"
//                   type="tel"
//                   defaultValue={user.phone}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold border-b pb-2">
//             Profile Details
//           </h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bio
//               </label>
//               <textarea
//                 name="bio"
//                 defaultValue={user.bio}
//                 rows={4}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 placeholder="Describe yourself and your experience..."
//               />
//             </div>

//             {user.role === "freelancer" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Hourly Rate
//                   </label>
//                   <div className="flex items-center">
//                     <CurrencyBangladeshiIcon className="h-5 w-5 text-gray-400 mr-2" />
//                     <input
//                       name="hourlyRate"
//                       type="number"
//                       defaultValue={user.hourlyRate}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Skills
//                   </label>
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {skills.map((skill) => (
//                       <span
//                         key={skill}
//                         className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center"
//                       >
//                         {skill}
//                         <button
//                           type="button"
//                           onClick={() => removeSkill(skill)}
//                           className="ml-2 hover:text-emerald-800"
//                         >
//                           <XMarkIcon className="h-4 w-4" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={inputSkill}
//                       onChange={(e) => setInputSkill(e.target.value)}
//                       onKeyPress={(e) => e.key === "Enter" && addSkill(e)}
//                       placeholder="Add skills"
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={addSkill}
//                       className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <input type="hidden" name="skills" value={skills.join(",")} />
//                 </div>
//               </div>
//             )}

//             {user.role === "client" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company
//                 </label>
//                 <div className="flex items-center">
//                   <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   <input
//                     name="company"
//                     defaultValue={user.company}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Security */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold border-b pb-2">Security</h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 New Password
//               </label>
//               <div className="flex items-center">
//                 <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
//                 <input
//                   name="password"
//                   type="password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm New Password
//               </label>
//               <div className="flex items-center">
//                 <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
//                 <input
//                   name="confirmPassword"
//                   type="password"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex justify-between items-center pt-8">
//           <button
//             type="button"
//             className="text-red-600 hover:text-red-700 flex items-center"
//           >
//             <TrashIcon className="h-5 w-5 mr-2" />
//             Delete Account
//           </button>

//           <div className="flex gap-4">
//             <button
//               type="button"
//               className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </Form>
//     </div>
//   );
// }
