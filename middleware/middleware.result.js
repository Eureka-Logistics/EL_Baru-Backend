module.exports = async (req) => {
const { validationResult } = require('express-validator')
  const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {
                    status: {
                        code: 400,
                        message: 'ADA KESALAHAN DI FORM INPUT',
                        error:true,
                    },
                    errors: errors.array().map((item) => {
                        return {
                            message: item.msg,
                            field: item.param,
                            value:item.value
                        }
                    })
                }
        
        }
}