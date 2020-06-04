
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class AutopiloService {
 
  endpointUrl: string = null;

  constructor(private httpClient: HttpClient,
              private environment: AppConfigService) {
                
   this.endpointUrl = environment.config.endPointUrl;
  }

  

  //
  getDefaultRun() {
    //const header = new HttpHeaders().set('Authorization','Bearer 	'+ 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ');
    // const headers = new HttpHeaders();
    const headers = {
        // 'Origin': 'https://40.85.158.201:8161',
        // 'Referer': 'https://40.85.158.201:8161/opsmx-analysis/public/canaryAnalysis.html',
        // 'Sec-Fetch-Dest': 'empty',
        // 'Sec-Fetch-Mode': 'cors', 
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
                        'Authorization': 'Bearer  eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwOi8vb3BzbXguY29tLyIsInN1YiI6IjEifQ.M_3bBDWxQDGhLy0Dj5a5lxbvnv2ahqTKd4c7lC4CTdrU8bhThL9DfDV2BplDkOWqpnVH08BOv9R0oRERiSJ1TQ' }
    return this.httpClient.get('https://40.85.158.201:8090/canaries/applicationNames',{ headers });
  }

}
