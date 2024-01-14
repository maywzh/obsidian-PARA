import {
	type MarkdownFileInfo,
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile
} from "obsidian";
import CreateForm from "./pages/Create.svelte";


// Remember to rename these classes and interfaces!

interface PARAPluginSettings {
	projectsFolder: string;
	areasFolder: string;
	resourcesFolder: string;
	archivesFolder: string;
}

const DEFAULT_SETTINGS: PARAPluginSettings = {
	projectsFolder: "",
	areasFolder: "",
	resourcesFolder: "",
	archivesFolder: "",
};

export default class PARAPlugin extends Plugin {
	settings!: PARAPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"PARA Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				// new Notice("This is a notice!");
				new RibbonClickModal(this.app).open();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("PARA is ready");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "create-new-para",
			name: "Create a new PARA",
			callback: () => {
				new CreateModal(this.app).open();
			},
		});

		// This adds an editor command that can perform some operation on the current editor instance
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new CreateModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		this.addCommand({
			id: "send-to-archive",
			name: "Send to Archive",
			checkCallback: (checking: boolean) => {},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PARASettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// this.registerEvent(
		// 	this.app.workspace.on("file-menu", (menu, file) => {
		// 		// 确保文件是一个TFile且符合我们的条件
		// 		if (file instanceof TFile && this.isFileProjectOrArea(file)) {
		// 			menu.addItem((item) => {
		// 				item.setTitle("Send to Archive")
		// 					.setIcon("paper-plane") // 或者选择一个合适的图标
		// 					.onClick(() => this.moveToArchive(file));
		// 			});
		// 		}
		// 	})
		// );

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	async triggerTemplaterCreate(file: TFile) {
		
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class RibbonClickModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onSubmit(value: string) {
		console.warn(value);
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h3", { text: "选择要添加的类型" });

		// 创建下拉框
		const selectEl = contentEl.createEl("select");
		selectEl.createEl("option", {
			text: "Resource",
			value: "resource",
		});
		selectEl.createEl("option", {
			text: "Project",
			value: "project",
		});
		selectEl.createEl("option", {
			text: "Area",
			value: "area",
		});
		selectEl.createEl("option", {
			text: "Archive",
			value: "archive",
		});

		// 创建按钮
		const buttonContainer = contentEl.createDiv();
		buttonContainer.createEl("button", { text: "确定" }, (btn) => {
			btn.onclick = () => this.onSubmit(selectEl.value);
		});
		buttonContainer.createEl("button", { text: "取消" }, (btn) => {
			btn.onclick = () => this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async createResourceFile() {
		const resourcesFolder = this.app.plugin.settings.resourcesFolder;

	}
}

class CreateModal extends Modal {
	component!: CreateForm;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		// contentEl.setText("Woah!");
		this.component = new CreateForm({
			target: contentEl
		})
	}

	onClose() {
		if (this.component) {
            // 销毁 Svelte 组件实例
            this.component.$destroy();
        }
		const { contentEl } = this;
		contentEl.empty();
	}
}

class PARASettingTab extends PluginSettingTab {
	plugin: PARAPlugin;

	constructor(app: App, plugin: PARAPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Projects Folder")
			.setDesc("Path for the Projects folder")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.projectsFolder)
					.onChange(async (value) => {
						this.plugin.settings.projectsFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Areas Folder")
			.setDesc("Path for the Areas folder")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.areasFolder)
					.onChange(async (value) => {
						this.plugin.settings.areasFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Resources Folder")
			.setDesc("Path for the Resources folder")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.resourcesFolder)
					.onChange(async (value) => {
						this.plugin.settings.resourcesFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Archives Folder")
			.setDesc("Path for the Archives folder")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.archivesFolder)
					.onChange(async (value) => {
						this.plugin.settings.archivesFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
