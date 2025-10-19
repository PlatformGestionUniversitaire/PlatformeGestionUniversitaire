import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
	constructor(private admin: AdminService) {}

	async exportCSV() {
		// placeholder - real implementation would call API and stream CSV
		const data = [['id','name'],['1','Exemple']];
		const csv = data.map(r=>r.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = 'report.csv'; a.click();
		URL.revokeObjectURL(url);
	}

	async exportPDF() {
		// naive PDF export - create printable window
		const html = `<h1>Rapport</h1><p>Généré le ${new Date().toLocaleString()}</p>`;
		const w = window.open('', '_blank');
		if (!w) return;
		w.document.write(html);
		w.print();
		w.close();
	}
}
