import Map "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

// Define the actor
actor SocialTaskManager {

  type Task = {
    description: Text;
    completed: Bool;
     reward: Text;
  };

  func natHash(n : Nat) : Hash.Hash { 
    Text.hash(Nat.toText(n))
  };

  var tasks = Map.HashMap<Nat, Task>(0, Nat.equal, natHash);
  var nextId : Nat = 0;

  public query func getTasks() : async [Task] {
    Iter.toArray(tasks.vals());
  };

  // Returns the ID that was given to the Task item
  public func addTask(description : Text, reward: Text) : async Nat {
    let id = nextId;
    tasks.put(id, { description = description; completed = false;reward = reward });
    nextId += 1;
    id
  };

 public func completeTask(id : Nat) : async () {
    switch (tasks.get(id)) {
      case (null) { /* Görev bulunamadı */ };
      case (?task) {
        tasks.put(id, { description = task.description; completed = true; reward = task.reward });
      };
    }
};


   public query func showTasks() : async Text {
    var output : Text = "\n___TASKS___";
    for (task : Task in tasks.vals()) {
      output #= "\n" # task.description;
      if (task.completed) { output #= " ✔ [Reward: " # task.reward # "]"; };
    };
    output # "\n"
  };


  public func clearCompleted() : async () {
    tasks := Map.mapFilter<Nat, Task, Task>(tasks, Nat.equal, natHash, 
              func(_, task) { if (task.completed) null else ?task });
  };
}

