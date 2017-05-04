import { CompanyService } from './company.service';
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-search-person',
    templateUrl: 'searchperson.component.html'
})
export class SearchPersonComponent {
    myForm: FormGroup;

    constructor(private companyService: CompanyService) {}

    onSubmit() {
        const name = this.myForm.value.name;
        this.companyService.searchPersons(name)
            .subscribe(
                data => console.log(data)
            ); // Return creeren en opvangen in var hier
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            name: new FormControl(null, [
                Validators.required
            ])
        });
    }
}