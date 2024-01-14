<script lang="ts">
	export let onDestroy: () => void;

	interface FormData {
		type: "Project" | "Area" | "Resource";
		deadline?: string;
		area?: string;
		priority?: number;
		urgency?: number;
		notes?: string;
		source?: string;
	}

	let formData: FormData = {
		type: "Project",
		priority: 1,
		urgency: 1,
	};

	function handleSubmit() {
		console.log("Submitted:", formData);
		close();
	}

	function handleClose() {
		console.log("Modal closed");
		close();
	}

	function handleCancel() {
		console.log("Cancelled");
		close();
	}

	function close() {
		onDestroy();
	}
</script>

<div class="modal">

	<div class="modal-header">
		<h2>Create New Item</h2>
		<button on:click={handleClose}>X</button>
	</div>
	<div class="modal-body">
		<label class="modal-label">
			Type:
			<select bind:value={formData.type}>
				<option value="Project">Project</option>
				<option value="Area">Area</option>
				<option value="Resource">Resource</option>
			</select>
		</label>

		{#if formData.type === "Project"}
			<label>
				Deadline:
				<input type="date" bind:value={formData.deadline} />
			</label>
			<label>
				Area:
				<input type="text" bind:value={formData.area} />
			</label>
		{/if}

		{#if formData.type === "Resource"}
			<label>
				Source:
				<input type="text" bind:value={formData.source} />
			</label>
		{/if}

		<label>
			Priority:
			<input type="number" bind:value={formData.priority} min="1" />
		</label>
		<label>
			Urgency:
			<input type="number" bind:value={formData.urgency} min="1" />
		</label>
		<label>
			Notes:
			<textarea bind:value={formData.notes}></textarea>
		</label>
	</div>
	<div class="modal-footer">
		<button on:click={handleSubmit}>Submit</button>
		<button on:click={handleCancel}>Cancel</button>
	</div>
</div>

<style>


</style>
