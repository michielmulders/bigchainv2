import { CompanyService } from '../_services/company.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from '../_models/user.model';
import { Subject }    from 'rxjs/Subject';

@Component({
    selector: 'app-auto-complete-person',
    templateUrl: './autocompleteperson.component.html',
    styles: [`
        .scrollable-menu {
            height: auto;
            max-height: 150px;
            overflow-x: hidden;
        }
    `] // Limit height of dropdown and make it scrollable
})
export class AutoCompletePerson implements OnInit {
    autoCompleteForm: FormGroup;
    private searchTerm = new Subject<string>();
    users: User[] = [];

    constructor(private companyService: CompanyService) { 
        // Get test persons for search string
        this.searchTerm.debounceTime(200).distinctUntilChanged().subscribe(searchTerm => {
            this.companyService.getAutoCompletePerson(searchTerm)
            .subscribe(
                data => this.users = data.users as User[], // Format to User Array
                error => console.error(error)
            );
        });
        // distinctUntilChanged: Only emit when the current value is different than the last
        // DebounceTime: Wait 200ms before sending another request 
    }

    // Update value of form with new user when selected from dropdown autocomplete
    changeInputAutoComplete(personName: string) {
        this.autoCompleteForm.patchValue({
            name: personName
        });

        this.companyService.createTestUser = personName;
        this.users = [];
    }

    ngOnInit() { 
        this.autoCompleteForm = new FormGroup({
            name: new FormControl(null, Validators.required)
        });
    }

    // If new key is typed in input -> push input string it to SubjectAutocomplete to get all test persons for that string
    onKeyup(searchText: string) {
        if(searchText.trim() != "") { this.searchTerm.next(searchText); } 
    }
}