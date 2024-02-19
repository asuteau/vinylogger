/* 
Netlify automatically appends origin query parameters to 
all redirected URLs if a query string is not present in the redirected URL
This handler fixes it by removing the query string from the redirected URL if the parameters are identical
*/

export default async (request, context) => {
  try{
      const url = new URL(request.url);
      if(!url.search) return;

      console.log(`Incoming URL: ${request.url}`);

      let res = await context.next();
      
      console.log(res.status);

      if([301,302].includes(res.status)){
          const location = res.headers.get('location'),
              redirectedQueryString = location?.slice(location.indexOf('?'));

          console.log(`Redirected URL: ${location}`);

          if(redirectedQueryString){

              const params = new URLSearchParams(redirectedQueryString);

              // Compare incoming and outgoing query parameters
              let identical = true;
              for(const [key, value] of url.searchParams.entries()){
                  if(params.get(key) !== value){
                      console.log(`Incoming and redirected query params are different: ${key}=${value} vs ${params.get(key)}`);
                      identical = false;
                      break;
                  }
              }

              if(identical){
                  console.log("Found identical query strings, stripping the redirect URL query string");
                  res.headers.set('location', location.split('?')[0]);
                  return res;
              }else{
                  console.log("Incoming and redirected query params are different, not altering location");
              }

          }
      }
      
  }catch(err){
      console.error(err);
  } 
}

export const config = {
  path: "/",
};