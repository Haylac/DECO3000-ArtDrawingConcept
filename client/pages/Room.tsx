import { useSync } from '@tldraw/sync'
import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tldraw, Editor, TLUiComponents } from 'tldraw'
import { getBookmarkPreview } from '../getBookmarkPreview'
import { multiplayerAssetStore } from '../multiplayerAssetStore'

// Hide all UI components
//https://tldraw.dev/examples/ui-components-hidden
const components: Required<TLUiComponents> = {
	ContextMenu: null,
	ActionsMenu: null,
	HelpMenu: null,
	ZoomMenu: null,
	MainMenu: null,
	Minimap: null,
	//StylePanel: null,
	PageMenu: null,
	NavigationPanel: null,
	//Toolbar: null,
	KeyboardShortcutsDialog: null,
	QuickActions: null,
	HelperButtons: null,
	DebugPanel: null,
	DebugMenu: null,
	SharePanel: null,
	MenuPanel: null,
	TopPanel: null,
	CursorChatBubble: null,
	RichTextToolbar: null,
	ImageToolbar: null,
	VideoToolbar: null,
	Dialogs: null,
	Toasts: null,
	A11y: null,
	FollowingIndicator: null,
}

export function Room() {
	const { roomId } = useParams<{ roomId: string }>()

	// Create stores for two separate instances
	const storeA = useSync({ uri: `${window.location.origin}/api/connect/${roomId}-A`, assets: multiplayerAssetStore })
	const storeB = useSync({ uri: `${window.location.origin}/api/connect/${roomId}-B`, assets: multiplayerAssetStore })

	const [activeStore, setActiveStore] = useState<'A' | 'B'>('A')
	const currentStore = activeStore === 'A' ? storeA : storeB

	const handleMount = (editor: Editor) => {
		editor.registerExternalAssetHandler('url', getBookmarkPreview)
		// onMount expects void, so we return nothing
	}

	return (
		<RoomWrapper roomId={roomId} activeStore={activeStore} setActiveStore={setActiveStore}>
			<Tldraw store={currentStore} deepLinks onMount={handleMount} components={components} />
		</RoomWrapper>
	)
}

function RoomWrapper({
	children,
	roomId,
	activeStore,
	setActiveStore,
}: {
	children: ReactNode
	roomId?: string
	activeStore: 'A' | 'B'
	setActiveStore: (v: 'A' | 'B') => void
}) {
	const [didCopy, setDidCopy] = useState(false)

	useEffect(() => {
		if (!didCopy) return
		const timeout = setTimeout(() => setDidCopy(false), 3000)
		return () => clearTimeout(timeout)
	}, [didCopy])

	return (
		<div className="RoomWrapper">
			<div className="RoomWrapper-header">
				<WifiIcon />
				<div>{roomId}</div>
				<button
					className="RoomWrapper-copy"
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						setDidCopy(true)
					}}
					aria-label="copy room link"
				>
					Copy link
					{didCopy && <div className="RoomWrapper-copied">Copied!</div>}
				</button>

				{/* Button to switch between instances */}
				<button
					onClick={() => setActiveStore(activeStore === 'A' ? 'B' : 'A')}
					style={{ marginLeft: '12px' }}
				>
					Switch Canvas ({activeStore})
				</button>
			</div>
			<div className="RoomWrapper-content">{children}</div>
		</div>
	)
}

function WifiIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			width={16}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
			/>
		</svg>
	)
}