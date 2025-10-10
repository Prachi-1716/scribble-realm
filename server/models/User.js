let mongoose = require("mongoose");
// Profile image name seeds
const profile_imgs_name_list = [
  "Luna", "Leo", "Mia", "Jack", "Felix", "Kiki", "Cleo", "Harley",
  "Annie", "Coco", "Gracie", "Bear", "Bella", "Abby", "Angel", "Bob",
  "Tinkerbell", "Garfield", "Cali", "Milo", "Nina", "Oscar", "Ruby",
  "Sasha", "Max", "Loki", "Simba", "Jasper", "Chloe", "Zoe"
];

// DiceBear collections (safe, cartoon/anime-like)
const profile_imgs_collections_list = [
  "lorelei",
  "micah",
  "adventurer",
  "notionists-neutral",
  "fun-emoji"
];

const userSchema = mongoose.Schema({

    personal_info: {
        fullName: {
            type: String,
            lowercase: true,
            minlength: [3, 'fullname must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            minlength: 6,
        },
        username:  String,
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: () => {
                const randomCollection =
                profile_imgs_collections_list[
                    Math.floor(Math.random() * profile_imgs_collections_list.length)
                ];
                const randomSeed =
                profile_imgs_name_list[
                    Math.floor(Math.random() * profile_imgs_name_list.length)
                ];

                // DiceBear v7 URL
                return `https://api.dicebear.com/7.x/${randomCollection}/svg?seed=${randomSeed}`;
            }
            }
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },

}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})

let User =  mongoose.model("User", userSchema);

module.exports = User;