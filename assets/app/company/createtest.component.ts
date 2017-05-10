import { CompanyService } from './company.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Test } from './test.model';
import { User } from '../auth/user.model';
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
            this.companyService.createTestUser, // name of user in MongoDB
            this.myForm.value.date,
            this.myForm.value.type,
            this.myForm.value.remark || ""
        );

        this.companyService.createTest(test)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset();
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
