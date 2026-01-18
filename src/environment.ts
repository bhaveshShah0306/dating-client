// environment.ts (DEV)
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
  cloudinary: {
    cloudName: 'dgooj7git',
    uploadPreset: 'dev_unsigned',
    apiKey: '246686756442747',
  },
};

export const ProdEnvironment = {
  production: true,
  cloudinary: {
    cloudName: 'dgoj7git',
    uploadPreset: 'prod_unsigned', // Different preset for production
  },
};

// // environment.qa.ts (QA)
// export const environment = {
//   production: false,
//   cloudinary: {
//     cloudName: 'your-app-qa',
//     uploadPreset: 'qa_unsigned',
//   },
// };

// // environment.uat.ts (UAT)
// export const environment = {
//   production: false,
//   cloudinary: {
//     cloudName: 'your-app-uat',
//     uploadPreset: 'uat_unsigned',
//   },
