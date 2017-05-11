import { CompanyService } from '../_services/company.service';
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-search-person',
    templateUrl: 'searchperson.component.html'
})
export class SearchPersonComponent {
    myForm: FormGroup;
    canDoTest: String; 

    constructor(private companyService: CompanyService) {}

    onSubmit() {
        this.companyService.searchPersonType(this.companyService.createTestUser, this.myForm.value.type)
        .subscribe(
            data => {
                data.canDoTest == true ? this.canDoTest = "Can't do test!" : this.canDoTest = "Can do test!";
            },
            error => console.error(error)
        );

        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            type: new FormControl(null, [
                Validators.required
            ])
        });
    }
}