import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let restaurants
export default class RestaturantsDAO{
    static async injectDB(conn){
        if(restaurants){
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        }
        catch(e){
            console.error(
                `Unable to establish connection handle in restaurantsDAO: ${e}`
            )
        }
    }
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 100,
    }={}){
        let query
        if(filters){
            if("name" in  filters){
                query = {$text: {$search: filters["name"]}}
            }
            else if("cuisine" in filters){
                query = {"cuisine": {$eq: filters["cuisine"]}}
            }
            else if("zipcode" in filters){
                query= {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor

        try{
            cursor = await restaurants.find(query)
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return {restaurantsList, totalNumRestaurants}
        }
        catch(e){
            console.error(`Unable to convert cursor to Array or documents counting problem: ${e}`)
            return  {restaurantsList: [], totalNumRestaurants: 0}
        }
    }

    static async getRestaurantByID(id){
        try{
            const pipeline = [
                {
                    $match:{
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup:{
                        from:"reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields:{
                        reviews: "$reviews",
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next()
        }
        catch(e){
            console.error(`Something went wrong in getRestaurantbyID: ${e}`)
            throw e
        }
    }
    static async getCuisines(){
        let cuisines = []
        try{
            cuisines= await restaurants.distinct("cuisine")
            return cuisines
        }
        catch(e){
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}