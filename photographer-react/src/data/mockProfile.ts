// import type { Profile, Photo } from '@/types'

// const PHOTO_DIMS = [
//   [800, 1067],  // 3:4  portrait
//   [1200, 800],  // 3:2  landscape
//   [800,  800],  // 1:1  square
//   [800, 1200],  // 2:3  portrait
//   [1200, 900],  // 4:3  landscape
//   [800, 1067],  // 3:4  portrait
//   [1200, 800],  // 3:2  landscape
//   [800, 1067],  // 3:4  portrait
//   [1200, 900],  // 4:3  landscape
// ] as const

// const CAMERAS = [
//   'Sony α7R V', 'Fujifilm X-T5', 'Leica M11', 'Nikon Z9', 'Canon EOS R5',
//   'Sony α7C II', 'Hasselblad X2D', 'Fujifilm GFX 100S', 'Nikon Z8', 'Canon EOS R3',
// ]
// const LENSES = [
//   'Sigma 35mm f/1.4 Art', 'Fujinon XF 50mm f/1.0', 'Leica Summicron-M 28mm f/2',
//   'Nikkor Z 85mm f/1.2 S', 'RF 24-70mm f/2.8L IS', 'Sony FE 24mm f/1.4 GM',
//   'Otus 55mm f/1.4', 'Voigtländer 40mm f/1.2', 'Laowa 15mm f/2 Zero-D', 'RF 85mm f/1.2L',
// ]
// const DATES = [
//   'January 2024', 'March 2024', 'July 2023', 'November 2023',
//   'April 2024', 'August 2023', 'February 2024', 'October 2023', 'June 2024',
// ]
// const LOCATIONS = [
//   'Mumbai, Maharashtra', 'Fort Kochi, Kerala', 'Jodhpur, Rajasthan',
//   'Varanasi, Uttar Pradesh', 'Spiti Valley, Himachal Pradesh', 'Hampi, Karnataka',
//   'Rishikesh, Uttarakhand', 'Madurai, Tamil Nadu', 'Kolkata, West Bengal',
// ]

// function makePhotos(albumSeed: string): Photo[] {
//   return PHOTO_DIMS.map(([w, h], i) => ({
//     id: `${albumSeed}-photo-${i}`,
//     url: `https://picsum.photos/seed/${albumSeed}-${i}/${w}/${h}`,
//     width: w,
//     height: h,
//     camera:      CAMERAS[i % CAMERAS.length],
//     lens:        LENSES[i % LENSES.length],
//     captureDate: DATES[i % DATES.length],
//     location:    LOCATIONS[i % LOCATIONS.length],
//   }))
// }

// const MOCK_PROFILE: Profile = {
//   name: 'Chaitanya',
//   location: 'Mumbai, India',
//   bio: 'Photographer capturing fleeting moments of light, texture, and emotion. Specialising in street and landscape photography.',
//   avatarUrl: 'https://picsum.photos/seed/chaitanya-avatar/400/400',
//   socialLinks: [
//     { label: 'Instagram', href: 'https://instagram.com' },
//     { label: '500px',     href: 'https://500px.com'     },
//     { label: 'Behance',   href: 'https://behance.net'   },
//   ],
//   albums: [
//     {
//       id: 'street',
//       title: 'Street',
//       caption: 'Urban life and candid moments',
//       coverUrl: 'https://picsum.photos/seed/street-cover/900/600',
//       photos: makePhotos('street'),
//     },
//     {
//       id: 'landscape',
//       title: 'Landscape',
//       caption: "Nature's grandeur",
//       coverUrl: 'https://picsum.photos/seed/landscape-cover/900/600',
//       photos: makePhotos('landscape'),
//     },
//     {
//       id: 'portrait',
//       title: 'Portrait',
//       caption: 'Faces and stories',
//       coverUrl: 'https://picsum.photos/seed/portrait-cover/900/600',
//       photos: makePhotos('portrait'),
//     },
//     {
//       id: 'minimal',
//       title: 'Minimal',
//       caption: 'Less is more',
//       coverUrl: 'https://picsum.photos/seed/minimal-cover/900/600',
//       photos: makePhotos('minimal'),
//     },
//     {
//       id: 'travel',
//       title: 'Travel',
//       caption: 'Around the world',
//       coverUrl: 'https://picsum.photos/seed/travel-cover/900/600',
//       photos: makePhotos('travel'),
//     },
//     {
//       id: 'architecture',
//       title: 'Architecture',
//       caption: 'Structures and spaces',
//       coverUrl: 'https://picsum.photos/seed/architecture-cover/900/600',
//       photos: makePhotos('architecture'),
//     },
//   ],
// }

// // export default MOCK_PROFILE
