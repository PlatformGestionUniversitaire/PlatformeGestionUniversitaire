import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'admin-events-management',
  standalone: true,
  imports: [CommonModule],
	templateUrl: './events-management.component.html',
	styleUrls: ['../../admin.styles.css', './events-management.component.css']
})
export class EventsManagementComponent implements OnInit {
	events: any[] = [];

	constructor(private admin: AdminService) {}

	ngOnInit(): void { this.load(); }

	async load() { this.events = (await this.admin.list('events')) || []; }

	async add() {
		const title = prompt('Titre de l\'événement');
		if (!title) return;
		await this.admin.create('events', { title, date: new Date().toISOString() });
		this.load();
	}

	async remove(e: any) {
		if (!confirm('Supprimer cet événement ?')) return;
		await this.admin.remove('events', e.id);
		this.load();
	}
}
