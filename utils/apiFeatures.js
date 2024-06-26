class APIFeatures{
    constructor(query,queryString){
        this.query = query
        this.queryString=queryString
    }

    filter(){
           //1A-Filtering
           const queryObject={...this.queryString}
           const excludedFields = ['page','sort','limit','fields']
           excludedFields.forEach(field=>delete queryObject[field])
           // console.log(req.query)
           // console.log(queryObject)
   
            //1B-Advanced Filtering (greater then or less then)
         
            let queryStr = JSON.stringify(queryObject)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(str=>`$${str}`));

            this.query = this.query.find(JSON.parse(queryStr))

            return this
    }
    sort(){
        if(this.queryString.sort){
             const sortBy =this.queryString.sort.split(',').join(' ')
             this.query = this.query.sort(sortBy)
          }else{
             this.query = this.query.sort('-createdAt')
             //sort=likes,createdAt --> [likes,createdAt] --> likes createdAt
          }
          return this
    }
    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
           this.query =this.query.select(fields)
         }else{
           this.query=this.query.select('-__v')
         }
         return this
    }
    paginate(){
        const page=this.queryString.page*1||1
        const limit=this.queryString.limit*1||100
        const skip= (page-1)*limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
   
}

module.exports= APIFeatures