library(plumber)

# Register a hook to add CORS headers and handle OPTIONS requests
addCORSAndHandleOptions <- function(req, res) {
  res$setHeader('Access-Control-Allow-Origin', '*')
  res$setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res$setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res$status <- 200
    # Ensure the response for OPTIONS is sent back immediately without further processing
    return(list())
}

# Create the router from your plumber script
pr <- plumber::pr("plumber.R")

# Add CORS and OPTIONS handling as a global filter
pr$registerHooks(
  list(
    preroute = addCORSAndHandleOptions
  )
)

pr$run(port=8000, host='0.0.0.0')
