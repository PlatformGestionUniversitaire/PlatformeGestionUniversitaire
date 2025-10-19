import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

interface ReferentialItem {
	id?: string;
	name?: string;
	title?: string;
	email?: string;
	label?: string;
	[key: string]: any;
}

interface Section {
	key: string;
	title: string;
	items: ReferentialItem[];
}

@Component({
	selector: 'admin-global-referentials',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './global-referentials.component.html',
	styleUrls: ['./global-referentials.component.css']
})
export class GlobalReferentialsComponent implements OnInit {
	sections: Section[] = [
		{ key: 'departments', title: 'Départements', items: [] },
		{ key: 'specialties', title: 'Spécialités', items: [] },
		{ key: 'teachers', title: 'Enseignants', items: [] },
		{ key: 'students', title: 'Étudiants', items: [] },
		{ key: 'rooms', title: 'Salles', items: [] },
		{ key: 'subjects', title: 'Matères', items: [] }
	];

	activeSection: Section = this.sections[0];

	constructor(private admin: AdminService) {}

	ngOnInit(): void {
		this.loadAll();
	}

	setSection(section: Section) {
		this.activeSection = section;
	}

	async loadAll() {
		for (const s of this.sections) {
			try {
				// fetch from API via AdminService - falls back to empty list
				s.items = (await this.admin.list(s.key)) || [];
			} catch (e) {
				s.items = [];
			}
		}
	}

	async remove(item: ReferentialItem) {
		if (!confirm('Confirmer la suppression ?')) return;
		await this.admin.remove(this.activeSection.key, item.id);
		this.loadAll();
	}

	// lightweight add (prompt-based) to keep changes minimal
	async add() {
		const name = prompt(`Nouveau ${this.activeSection.title}`);
		if (!name) return;
		await this.admin.create(this.activeSection.key, { name });
		this.loadAll();
	}
}
