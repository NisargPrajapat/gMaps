// // import mongoose from 'mongoose';

// // const userSchema = new mongoose.Schema({
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   name: {
// //     type: String,
// //     trim: true,
// //   },
// //   phone: {
// //     type: String,
// //     trim: true,
// //   },
// //   address: {
// //     type: String,
// //     trim: true,
// //   },
// //   savedMaps: [{
// //     imageUrl: {
// //       type: String,
// //       required: true
// //     },
// //     createdAt: {
// //       type: Date,
// //       default: Date.now
// //     }
// //   }],
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // export default mongoose.model('User', userSchema);


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     trim: true,
//   },
//   address: {
//     type: String,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('User', userSchema);