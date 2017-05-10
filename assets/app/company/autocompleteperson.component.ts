import { CompanyService } from './company.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from '../auth/user.model';
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
        this.searchTerm.debounceTime(200).distinctUntilChanged().subscribe(searchTerm => {
            this.companyService.getAutoCompletePerson(searchTerm)
            .subscribe(
                data => this.users = data.users as User[],
                error => console.error(error)
            );
        });
        // distinct: Only emit when the current value is different than the last
    }

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

    onKeyup(searchText: string) {
        if(searchText.trim() != "") { this.searchTerm.next(searchText); } 
    }
}