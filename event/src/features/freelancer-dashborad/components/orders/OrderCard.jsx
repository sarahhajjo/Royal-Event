import StatusBadge from "./StatusBadge";
import BookmarkIcon from "../icons/BookmarkIcon";
import MoreOptionsIcon from "../icons/MoreOptionsIcon";
import RestoreIcon from "../icons/RestoreIcon";
import InfoIcon from "../icons/InfoIcon";

export default function OrderCard({ order }) {
    const isCancelled = order.status === "cancelled";
    const isRejected = order.status === "rejected";

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-paper transition-all">
            <div className="relative h-32 w-full">
                <img src={order.image} alt={order.title} className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3">
                    <StatusBadge status={order.status} />
                </div>
            </div>

            <div className="space-y-3 p-4">
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">{order.title}</h3>
                    <p className="mt-0.5 text-xs text-text-secondary">Order {order.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                        <p className="text-text-secondary">Client</p>
                        <p className="mt-0.5 text-text-primary/90">{order.client}</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">Event date</p>
                        <p className="mt-0.5 text-text-primary/90">{order.eventDate}</p>
                    </div>
                    {order.location && (
                        <div>
                            <p className="text-text-secondary">Location</p>
                            <p className="mt-0.5 text-text-primary/90">{order.location}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-text-secondary">Price</p>
                        <p className={`mt-0.5 font-semibold ${isCancelled ? "text-text-secondary line-through" : "text-primary"}`}>
                            {order.price}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    {isCancelled ? (
                        <>
                            <button disabled className="h-9 flex-1 rounded-md border border-border bg-gray-50 text-xs text-text-secondary">Archived</button>
                            <InfoIcon />
                        </>
                    ) : isRejected ? (
                        <>
                            <button className="h-9 flex-1 rounded-md border border-primary/30 bg-primary/10 text-xs font-medium text-primary hover:bg-primary/20">Reconsider</button>
                            <button className="h-9 w-9 shrink-0 rounded-md border border-border bg-bg-default text-primary hover:bg-gray-100">
                                <RestoreIcon className="mx-auto" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="h-9 flex-1 rounded-md bg-primary text-xs font-semibold text-bg-default hover:opacity-90">
                                {order.status === "confirmed" ? "Manage details" : "Accept request"}
                            </button>
                            <BookmarkIcon />
                            <MoreOptionsIcon />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}