import { CompanyService } from '../_services/company.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Test } from '../_models/test.model';
import { User } from '../_models/user.model';
import { Subject }    from 'rxjs/Subject';


@Component({
    selector: 'app-create-test',
    templateUrl: 'createtest.component.html'
})
export class CreateTestComponent implements OnInit {
    myForm: FormGroup;
    
    constructor(private companyService: CompanyService) {}

    onSubmit() {
        const test = new Test(
            this.companyService.createTestUser, // name of selected user from autocomplete dropdown
            this.myForm.value.date,
            this.myForm.value.type,
            this.myForm.value.remark || ""
        );

        // Create Test on BigchainDB
        this.companyService.createTest(test)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset({date:(new Date()).toISOString().slice(0,10)}); // Give new date to date formControl for default value
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            date: new FormControl((new Date()).toISOString().slice(0,10), [
                Validators.pattern('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}'),
                Validators.required
            ]),
            type: new FormControl(null, Validators.required),
            remark: new FormControl(null, null)
        });
    }
}
