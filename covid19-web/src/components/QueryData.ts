
export  class QueryData {

    private readonly queryName: string;
    private data: any;
    public returnData: any;

    constructor(queryName: string) {
        this.queryName = queryName;
        this.data = {};
        this.returnData = [];
    }


    async initData(filters: Map<string, string>|undefined) {

        let filterStr = '';
        if (filters) {
            filters.forEach((value, key) => {
                let prefix = '&';
                if (filterStr.length > 0) {
                    prefix = '&'
                }
                filterStr += prefix + key + '=' + value;
            });
        }

        this.data = await this.getAPIData(filterStr);
    }

    getAPIData(filterStr: string): Promise<any> {
        let url = process.env.REACT_APP_HPCCSYSTEMS_API_CLUSTER + this.queryName +`/json?`+ filterStr +`&submit_type=json`;
        let headers = new Headers();
        let username = localStorage.getItem('hpccsystems.covid19.auth.username');
        let password = localStorage.getItem('hpccsystems.covid19.auth.password');
        headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
        return fetch(url, {method:'GET', headers})
            .then(res => res.json())
    }


    getData(resultName: string): any {
        let stack: any[] = [];

        this.traverse(this.data, resultName, stack);

        if (stack.length > 0) {
            let resultData = stack.pop();
            return resultData;
        } else return [];
    }

    getJSONData(jsonObj:object): any{
        let nou = new Map();
        let jsonMap = new Map();
        if(this.queryName === 'hpccsystems_covid19_query_travel_form'){
            // console.log(jsonObj);
            for (const [key, value] of Object.entries(jsonObj)){
                nou.set(key, value);
            }
            JSON.stringify(nou);

            if(nou.has('iata')){
                jsonMap = nou;
            }

            return jsonMap;
        }
        else { return }
    }

    traverse(jsonObj:object, resultName:string, stack:any[]) {
        if( jsonObj !== null && typeof jsonObj == "object" ) {
            //create function to return object yay!
            this.returnData = this.getJSONData(jsonObj);
            Object.entries(jsonObj).forEach(([key, value]) => {
                if (key===resultName) {
                    stack.push(value.Row);
                } else {
                    this.traverse(value, resultName, stack);
                }
            });
        }
        else {

        }
    }


}