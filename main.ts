import axios from "axios";
import * as E from "fp-ts/lib/Either";
import { Lazy, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import {
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	Vault,
} from "obsidian";

interface Settings {
	url: string;
	apiKey: string;
}

const DEFAULT_SETTINGS: Settings = {
	url: "",
	apiKey: "",
};

export default class FilePublisher extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!("extension" in file)) {
					return;
				}

				const { url, apiKey } = this.settings;
				const token = Buffer.from(`${apiKey}`).toString();

				menu.addItem((item) => {
					item
						.setTitle("Sync file to my Blog")
						.setIcon("document")
						.onClick(() =>
							pipe(
								file,
								log("Syncing file..."),
								TE.fromNullable(new Error("File not found")),
								TE.chain(publishFile(this.app.vault, url, token)),
								TE.match(
									(e) => notify(e, "Negative API response: " + JSON.stringify(e)),
									() => notify(undefined, "File has been synced")
								)
							)()
						);
				});
			})
		);

		this.addSettingTab(new FilePublisherTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

const TEthunk = <A>(f: Lazy<Promise<A>>) => TE.tryCatch(f, E.toError);

const publishFile =
	(vault: Vault, url: string, token: string) => (file: TFile) =>
		pipe(
			TE.right({ "file_name": file.name }),
			TE.bind("content", () => TEthunk(() => vault.read(file))),
			TE.chain((data) =>
				TEthunk(() =>
					axios.post(url, data, {
						headers: {
							"Content-Type": "multipart/form-data",
							"Authorization": "Bearer " + token,
						},
					})
				)
			),
			TE.chain(() => TE.right(file))
		);

const log =
	(msg: string) =>
	<A>(a: A) => {
		console.log(msg);
		return a;
		};

const notify = (e: Error | undefined, msg: string) => {
	console.log(msg);

	if (e) {
		console.error(e);
	}

	new Notice(msg);
};

class FilePublisherTab extends PluginSettingTab {
	plugin: FilePublisher;

	constructor(app: App, plugin: FilePublisher) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h3", { text: "Simple File Push Settings" });

		new Setting(containerEl)
			.setName("Publisher URL")
			.setDesc(
				"This should be a POST url where the file is sent as a multipart/form-data body to."
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter the url")
					.setValue(this.plugin.settings.url)
					.onChange(async (value) => {
						this.plugin.settings.url = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("API Key")
			.setDesc(
				"API Key used when posting a file to the URL. NOTE: this is passed as the user of the bearer authorization header."
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter your key")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
