import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TicketService } from '../../data-access/ticket.service';
import { Ticket } from '../../data-access/ticket.model';

type DerivedStatus = 'OPEN' | 'PARTIALLY_PAID' | 'PAID';

@Component({
  selector: 'app-ticket-list',
  imports: [DatePipe, CurrencyPipe],
  styleUrl: './ticket-list.css',
  templateUrl: './ticket-list.html',
})
export default class TicketList implements OnInit {
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly showOnlyToday = signal(false);
  readonly loading = signal(false);
  readonly payingId = signal<string | null>(null);
  readonly payAmount = signal<number>(0);

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    const req = this.showOnlyToday() ? this.ticketService.getToday() : this.ticketService.getAll();
    req.subscribe({
      next: (data) => {
        this.tickets.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleFilter(): void {
    this.showOnlyToday.set(!this.showOnlyToday());
    this.loadTickets();
  }

  openPayForm(id: string): void {
    this.payingId.set(id);
    this.payAmount.set(0);
  }

  cancelPayForm(): void {
    this.payingId.set(null);
  }

  submitPay(ticket: Ticket): void {
    const amount = this.payAmount();
    if (!amount || amount <= 0) {
      alert('Ingresá un monto válido.');
      return;
    }
    const pending = this.pendingAmount(ticket);
    if (amount > pending) {
      alert(`El monto supera el saldo pendiente ($${pending.toFixed(2)}).`);
      return;
    }
    this.ticketService.addPay({ id: ticket.id, pay: amount }).subscribe({
      next: (updated) => {
        this.tickets.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
        this.payingId.set(null);
      },
      error: () => alert('Error al registrar el pago.'),
    });
  }

  cancelTicket(id: string): void {
    if (!confirm('¿Cancelar este ticket?')) return;
    this.ticketService.cancel(id).subscribe({
      next: () => this.tickets.update((list) => list.filter((t) => t.id !== id)),
      error: () => alert('Error al cancelar el ticket.'),
    });
  }

  derivedStatus(ticket: Ticket): DerivedStatus {
    if (ticket.amount > 0 && ticket.paid >= ticket.amount) return 'PAID';
    if (ticket.paid > 0) return 'PARTIALLY_PAID';
    return 'OPEN';
  }

  statusLabel(ticket: Ticket): string {
    const labels: Record<DerivedStatus, string> = {
      OPEN: 'Abierto',
      PARTIALLY_PAID: 'Pago parcial',
      PAID: 'Pagado',
    };
    return labels[this.derivedStatus(ticket)];
  }

  pendingAmount(ticket: Ticket): number {
    return ticket.amount - ticket.paid;
  }

  isPaid(ticket: Ticket): boolean {
    return this.derivedStatus(ticket) === 'PAID';
  }
}
