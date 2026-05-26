import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class JsonTicketStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async list() {
    try {
      return JSON.parse(await readFile(this.filePath, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async get(ticketId) {
    return (await this.list()).find((ticket) => ticket.id === ticketId) ?? null;
  }

  async save(ticket) {
    const tickets = await this.list();
    const existingIndex = tickets.findIndex((item) => item.id === ticket.id);

    if (existingIndex === -1) {
      tickets.push(ticket);
    } else {
      tickets[existingIndex] = ticket;
    }

    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(tickets, null, 2)}\n`);
    return ticket;
  }
}
